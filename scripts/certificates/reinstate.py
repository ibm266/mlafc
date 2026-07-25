#!/usr/bin/env python3
"""Paste the authentic certificate back into a generated frame.

GPT Image renders the gilt frame convincingly but it cannot be trusted with
small circular seals and crests: it re-letters the ring text into plausible
looking nonsense. This step puts the real document back, so only the frame is
generated and every character, seal and signature on the certificate itself is
the original photograph again.

Deterministic: pad, resize and paste only. No AI, no network.

Usage:
  python3 scripts/certificates/reinstate.py <framed.png> <master.png> <out.png> \
    '{"rect":[left,top,right,bottom]}'

`rect` is the mount opening in <framed.png> pixels, that is the hole the
document sits in, measured just inside the gold inner lip. Read it off a
coordinate grid (scripts/certificates/corner-sheet.py, or any grid overlay).

The document is never stretched: its aspect ratio is preserved in every mode,
because distorting a certificate is itself a form of falsification.

Config keys:
  rect      [l,t,r,b] required, the mount opening in framed-image pixels
  mode      how to reconcile the master's aspect with the opening's:
              pad    (default) extend the master's outermost pixels outward
                     until it matches the opening, then scale to fit exactly.
                     Only safe when the master's edges are blank margin: on a
                     design that bleeds to the edge it smears the ribbon or
                     border into streaks.
              fit    scale to fit inside the opening and fill the leftover
                     band with the frame's own mount, extended inward from
                     just outside the opening. Use on bleed-to-edge designs.
              cover  scale to cover and centre-crop. Only use when the master
                     has generous blank margin to give away, and check what it
                     trimmed against the printed border.
  feather   px of soft edge on the pasted document (default 0, keep it crisp)

Requires: Pillow
"""
import sys
import json
from PIL import Image, ImageFilter


def pad_to_aspect(im, target_aspect):
    """Grow the image to target_aspect by replicating its edge pixels."""
    w, h = im.size
    aspect = w / h
    if abs(aspect - target_aspect) < 1e-6:
        return im
    if aspect < target_aspect:
        new_w, new_h = round(h * target_aspect), h
    else:
        new_w, new_h = w, round(w / target_aspect)

    out = Image.new(im.mode, (new_w, new_h))
    ox, oy = (new_w - w) // 2, (new_h - h) // 2
    out.paste(im, (ox, oy))

    # replicate the outermost row/column into each band
    if ox > 0:
        out.paste(im.crop((0, 0, 1, h)).resize((ox, h), Image.NEAREST), (0, oy))
        out.paste(im.crop((w - 1, 0, w, h)).resize((new_w - w - ox, h), Image.NEAREST),
                  (ox + w, oy))
    if oy > 0:
        out.paste(im.crop((0, 0, w, 1)).resize((w, oy), Image.NEAREST), (ox, 0))
        out.paste(im.crop((0, h - 1, w, h)).resize((w, new_h - h - oy), Image.NEAREST),
                  (ox, oy + h))
    # corners, only reached when both bands exist (they never do at once here)
    return out


def reinstate(framed_path, master_path, out_path, cfg):
    framed = Image.open(framed_path).convert('RGB')
    master = Image.open(master_path).convert('RGB')

    l, t, r, b = cfg['rect']
    rw, rh = r - l, b - t
    if rw <= 0 or rh <= 0:
        raise SystemExit('rect must be [left, top, right, bottom] with r > l and b > t')

    mode = cfg.get('mode', 'pad')
    mw, mh = master.size

    if mode == 'cover':
        scale = max(rw / mw, rh / mh)
        sw, sh = round(mw * scale), round(mh * scale)
        doc = master.resize((sw, sh), Image.LANCZOS)
        ox, oy = (sw - rw) // 2, (sh - rh) // 2
        doc = doc.crop((ox, oy, ox + rw, oy + rh))
        note = (f'trimmed {round((sw - rw) / scale)}px horizontally, '
                f'{round((sh - rh) / scale)}px vertically from the master')
    elif mode == 'pad':
        padded = pad_to_aspect(master, rw / rh)
        doc = padded.resize((rw, rh), Image.LANCZOS)
        pw, ph = padded.size
        note = (f'padded {pw - mw}px horizontally, {ph - mh}px vertically '
                f'by edge replication, nothing cropped')
    elif mode == 'fit':
        scale = min(rw / mw, rh / mh)
        fw, fh = round(mw * scale), round(mh * scale)
        fitted = master.resize((fw, fh), Image.LANCZOS)
        # Fill the leftover with the flat mount colour. Sample well outside the
        # opening: right at the edge is the gold inner lip, which smears.
        off = cfg.get('mount_offset', 30)
        patches = [
            framed.crop((l, max(t - off - 8, 0), r, max(t - off, 1))),
            framed.crop((l, min(b + off, framed.height - 1),
                         r, min(b + off + 8, framed.height))),
        ]
        px = [p for patch in patches for p in patch.convert('RGB').getdata()]
        px.sort(key=lambda c: c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114)
        mount = px[len(px) // 2]
        doc = Image.new('RGB', (rw, rh), mount)
        doc.paste(fitted, ((rw - fw) // 2, (rh - fh) // 2))
        note = (f'fitted to {fw}x{fh}, {rw - fw}px horizontal and {rh - fh}px '
                f'vertical leftover filled with mount colour rgb{mount}, '
                f'nothing cropped')
    else:
        raise SystemExit(f'unknown mode {mode!r}, use "pad", "fit" or "cover"')

    out = framed.copy()
    feather = cfg.get('feather', 0)
    if feather:
        mask = Image.new('L', (rw, rh), 255).filter(ImageFilter.GaussianBlur(feather))
        out.paste(doc, (l, t), mask)
    else:
        out.paste(doc, (l, t))

    out.save(out_path)
    print(f'wrote {out_path}  {out.size[0]}x{out.size[1]}  mode={mode}')
    print(f'  opening {rw}x{rh}  master {mw}x{mh}')
    print(f'  {note}')


if __name__ == '__main__':
    if len(sys.argv) < 5:
        print(__doc__)
        raise SystemExit(1)
    reinstate(sys.argv[1], sys.argv[2], sys.argv[3], json.loads(sys.argv[4]))
