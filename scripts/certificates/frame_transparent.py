#!/usr/bin/env python3
"""Make a framed certificate's background transparent, deterministically.

Use this when the AI background remover eats the ornate frame (it can mistake
the inner document for the subject). It flood-fills the flat dark background
from the image borders, so the whole gilt frame is kept and any dark areas
ENCLOSED by the frame (for example a portrait's dark backdrop) stay opaque.

Input is the framed image (ornate frame on a flat dark background, e.g. the
GPT Image output). Output is a transparent WebP.

Usage:
  python3 scripts/certificates/frame_transparent.py <framed.png> \
    public/images/certificates/<slug>.webp [thresh] [long_edge] [quality]

Requires: Pillow, numpy
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SENT = (255, 0, 255)  # sentinel fill colour, absent from gold/paper/gowns


def frame_transparent(src, out, thresh=42, long_edge=2000, quality=76):
    im = Image.open(src).convert("RGB")
    w, h = im.size
    flood = im.copy()
    seeds = []
    for t in range(0, 101, 5):
        x = int((w - 1) * t / 100)
        y = int((h - 1) * t / 100)
        seeds += [(x, 0), (x, h - 1), (0, y), (w - 1, y)]
    for xy in seeds:
        if flood.getpixel(xy) != SENT:
            ImageDraw.floodfill(flood, xy, SENT, thresh=thresh)
    bg = np.all(np.asarray(flood) == np.array(SENT), axis=2)
    alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8))
    # erode 1px + slight feather to remove the thin shadow halo at the edge
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
    out_im = im.convert("RGBA")
    out_im.putalpha(alpha)
    bbox = out_im.split()[3].getbbox()
    if bbox:
        out_im = out_im.crop(bbox)
    W, H = out_im.size
    s = long_edge / max(W, H)
    if s < 1:
        out_im = out_im.resize((round(W * s), round(H * s)), Image.LANCZOS)
    out_im.save(out, "WEBP", quality=quality, method=6)
    import os
    print(f"wrote {out}  {out_im.size[0]}x{out_im.size[1]}  {os.path.getsize(out)//1024} KB")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        raise SystemExit(1)
    a = sys.argv
    frame_transparent(
        a[1], a[2],
        thresh=int(a[3]) if len(a) > 3 else 42,
        long_edge=int(a[4]) if len(a) > 4 else 2000,
        quality=int(a[5]) if len(a) > 5 else 76,
    )
