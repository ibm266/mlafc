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
  wb          bool, white-balance to neutralise paper cast (default true)
  paper_pct   percentile that counts as paper for white balance (default 90)
  levels      bool, per-channel percentile stretch (default true)
  levels_pct  [low, high] percentiles (default [0.4, 99.6])
  denoise     bool (default true)
  denoise_amt median-blend strength 0..1 (default 0.35)
  sharpen     bool (default true)
  sharpen_amt unsharp percent (default 110)
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
    if cfg.get('wb', True):
        arr = white_balance(arr, cfg.get('paper_pct', 90))
    if cfg.get('levels', True):
        arr = levels(arr, *cfg.get('levels_pct', (0.4, 99.6)))
    im = Image.fromarray(arr.astype(np.uint8))

    if cfg.get('denoise', True):
        im = Image.blend(im, im.filter(ImageFilter.MedianFilter(3)), cfg.get('denoise_amt', 0.35))
    if cfg.get('sharpen', True):
        im = im.filter(ImageFilter.UnsharpMask(2.2, cfg.get('sharpen_amt', 110), 2))

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
