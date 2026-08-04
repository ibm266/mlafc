#!/usr/bin/env python3
"""Restore and export a photographed certificate for the certification wall.

Deterministic only: perspective correction, deskew, crop, white balance,
levels, gentle denoise and unsharp. It NEVER regenerates pixels, so text,
seals, signatures and faces are preserved exactly. No AI, no network.

Usage:
  python3 scripts/certificates/restore.py <src.jpg> <out.jpg> '<json-config>'

If <out> ends in .jpg/.jpeg it is resized to a web derivative (default 2000px
long edge) and quality-searched under a size budget. If it ends in .png the
full-resolution master is written instead.

Config keys (all optional):
  corners     [[TLx,TLy],[TRx,TRy],[BRx,BRy],[BLx,BLy]] in source px
  out_w,out_h target size for the perspective warp (required with corners)
  rotate      fine deskew in degrees (positive = counter-clockwise)
  crop        [left,top,right,bottom] as fractions (<1) or pixels to trim
  flatten     even out uneven lighting 0..1 (default 0, off). Divides out a
              smooth shading field, so a tungsten cast, a corner shadow or a
              soft reflection on the paper flattens away. Low frequency only:
              text, seals, signatures and faces keep every pixel of shape.
  flatten_pct percentile that counts as paper when estimating the field
              (default 88); lower it if the document is mostly ink
  wb          bool, white-balance to neutralise paper cast (default true)
  paper_pct   percentile that counts as paper for white balance (default 90)
  levels      bool, per-channel percentile stretch (default true)
  levels_pct  [low, high] percentiles (default [0.4, 99.6])
  denoise     bool (default true)
  denoise_amt median-blend strength 0..1 (default 0.35)
  sharpen     bool (default true)
  sharpen_amt unsharp percent (default 110)
  pad         [left,top,right,bottom] px of blank margin to add back, mirror
              tiled from the paper just inside each edge, so the grain carries
              on instead of streaking. For a photograph that clipped a margin
              the sheet really has. Blank paper only, never an edge a printed
              border or a ribbon reaches.
  pad_src     [left,top,right,bottom] thickness of the clear strip each pad is
              tiled from (default: the pad itself). Set it when the blank
              margin is thinner than the pad, or the mirror pulls the printed
              border back into the margin as a ghost.
  grain       extra edge-preserving smoothing for jpg export 0..1 (default 0)
  long_edge   web long edge in px (default 2000)
  max_kb      web size budget in KB (default 350)

Requires: Pillow, numpy  (pip install pillow numpy)
"""
import sys
import json
import numpy as np
from PIL import Image, ImageFilter, ImageOps


def perspective_coeffs(dst, src):
    a, b = [], []
    for (x, y), (X, Y) in zip(dst, src):
        a.append([x, y, 1, 0, 0, 0, -X * x, -X * y]); b.append(X)
        a.append([0, 0, 0, x, y, 1, -Y * x, -Y * y]); b.append(Y)
    return np.linalg.solve(np.array(a, dtype=np.float64), np.array(b, dtype=np.float64)).tolist()


def do_perspective(im, corners, out_w, out_h):
    dst = [(0, 0), (out_w, 0), (out_w, out_h), (0, out_h)]
    return im.transform((out_w, out_h), Image.PERSPECTIVE,
                        perspective_coeffs(dst, corners), Image.BICUBIC)


def mirror_pad(arr, n, src):
    """Extend the bottom edge by n rows, mirror-tiled from the last src rows.

    Only those rows are ever mirrored, so a printed border further up cannot
    reappear as a ghost in the margin. Rotate the array to reach another edge.
    """
    if n <= 0:
        return arr
    src = max(1, min(src, arr.shape[0]))
    band = np.pad(arr[-src:], ((0, n), (0, 0), (0, 0)), mode='symmetric')[src:]
    return np.concatenate([arr, band], axis=0)


def flatten_illumination(arr, amount, paper_pct=88):
    """Divide out the lighting so the paper reads evenly across the sheet.

    The shading field is a high percentile taken over a coarse grid of blocks,
    not a blur, so ink never drags the field down and no halo appears around
    the lettering. Every block is far bigger than a glyph, so what is removed
    is the lamp, the shadow and the sheen, never the document.
    """
    h, w, _ = arr.shape
    # estimate on a small copy: cheap, and averages away the paper texture
    small = np.asarray(
        Image.fromarray(arr.astype(np.uint8)).resize((max(w // 8, 8), max(h // 8, 8)), Image.BOX)
    ).astype(np.float32)
    sh, sw, _ = small.shape
    by, bx = max(sh // 40, 1), max(sw // 40, 1)
    gh, gw = sh // by, sw // bx
    tiles = small[:gh * by, :gw * bx].reshape(gh, by, gw, bx, 3)
    field = np.percentile(tiles, paper_pct, axis=(1, 3)).astype(np.float32)
    field = Image.fromarray(np.clip(field, 1, 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    field = np.asarray(field.filter(ImageFilter.GaussianBlur(max(w, h) / 90))).astype(np.float32)
    ref = np.percentile(field.reshape(-1, 3), 65, axis=0)
    gain = 1.0 + (ref[None, None, :] / np.maximum(field, 1.0) - 1.0) * amount
    return np.clip(arr * gain, 0, 255)


def white_balance(arr, paper_pct=90):
    mx = arr.max(axis=2); mn = arr.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    lum = 0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2]
    thr = np.percentile(lum, paper_pct)
    mask = (lum >= thr) & (sat < 0.35)
    if mask.sum() < 50:
        mask = lum >= thr
    means = np.array([arr[..., c][mask].mean() for c in range(3)])
    gain = np.clip(246.0 / np.maximum(means, 1), 0.6, 1.8)
    return np.clip(arr * gain[None, None, :], 0, 255)


def levels(arr, lo_pct=0.4, hi_pct=99.6):
    out = np.empty_like(arr)
    for c in range(3):
        ch = arr[..., c]
        lo = np.percentile(ch, lo_pct); hi = np.percentile(ch, hi_pct)
        if hi <= lo:
            hi = lo + 1
        out[..., c] = np.clip((ch - lo) * 255.0 / (hi - lo), 0, 255)
    return out


def restore(src, out, cfg):
    im = ImageOps.exif_transpose(Image.open(src).convert('RGB'))

    if cfg.get('corners'):
        im = do_perspective(im, cfg['corners'], cfg['out_w'], cfg['out_h'])
    if cfg.get('rotate'):
        im = im.rotate(cfg['rotate'], resample=Image.BICUBIC, fillcolor=(245, 244, 240))
    if cfg.get('crop'):
        l, t, r, b = cfg['crop']; W, H = im.size
        px = lambda v, d: int(v * d) if v < 1 else int(v)
        im = im.crop((px(l, W), px(t, H), W - px(r, W), H - px(b, H)))

    arr = np.asarray(im).astype(np.float32)
    if cfg.get('flatten'):
        arr = flatten_illumination(arr, cfg['flatten'], cfg.get('flatten_pct', 88))
    if cfg.get('wb', True):
        arr = white_balance(arr, cfg.get('paper_pct', 90))
    if cfg.get('levels', True):
        arr = levels(arr, *cfg.get('levels_pct', (0.4, 99.6)))
    im = Image.fromarray(arr.astype(np.uint8))

    if cfg.get('denoise', True):
        im = Image.blend(im, im.filter(ImageFilter.MedianFilter(3)), cfg.get('denoise_amt', 0.35))
    if cfg.get('sharpen', True):
        im = im.filter(ImageFilter.UnsharpMask(2.2, cfg.get('sharpen_amt', 110), 2))

    if cfg.get('pad'):
        pad = [int(v) for v in cfg['pad']]
        src = cfg.get('pad_src') or pad
        src = [int(v) for v in src]
        a = np.asarray(im)
        a = mirror_pad(a, pad[3], src[3])                                  # bottom
        a = mirror_pad(a[::-1], pad[1], src[1])[::-1]                      # top
        a = mirror_pad(a.swapaxes(0, 1), pad[2], src[2]).swapaxes(0, 1)    # right
        a = mirror_pad(a.swapaxes(0, 1)[::-1], pad[0], src[0])[::-1].swapaxes(0, 1)
        im = Image.fromarray(a)

    lower = out.lower()
    if lower.endswith('.jpg') or lower.endswith('.jpeg'):
        long_edge = cfg.get('long_edge', 2000)
        W, H = im.size; s = long_edge / max(W, H)
        if s < 1:
            im = im.resize((round(W * s), round(H * s)), Image.LANCZOS)
        grain = cfg.get('grain', 0.0)
        if grain > 0:
            im = Image.blend(im, im.filter(ImageFilter.MedianFilter(3)), grain)
        max_kb = cfg.get('max_kb', 350); q = 82
        import os
        while True:
            im.save(out, 'JPEG', quality=q, optimize=True, progressive=True)
            kb = os.path.getsize(out) / 1024
            if kb <= max_kb or q <= 62:
                break
            q -= 3
        print(f'wrote {out}  {im.size[0]}x{im.size[1]}  q{q}  {kb:.0f} KB')
    else:
        im.save(out)
        print(f'wrote {out}  {im.size[0]}x{im.size[1]}  (master)')


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(__doc__)
        raise SystemExit(1)
    conf = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
    restore(sys.argv[1], sys.argv[2], conf)
