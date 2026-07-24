"""Make a 2x2 contact sheet of the four corners of an image, each zoomed,
with a pixel grid + coordinate labels so document corners can be read off.
Usage: corner_sheet.py <img> <out.png> [cropfrac]
"""
import sys
from PIL import Image, ImageDraw

path, out = sys.argv[1], sys.argv[2]
frac = float(sys.argv[3]) if len(sys.argv) > 3 else 0.22
im = Image.open(path).convert('RGB')
W, H = im.size
cw, ch = int(W*frac), int(H*frac)
tile = 520
gap = 8

def make_tile(box, ox, oy):
    crop = im.crop(box).resize((tile, tile))
    d = ImageDraw.Draw(crop)
    sx = tile / (box[2]-box[0])
    sy = tile / (box[3]-box[1])
    step = 100  # original px between grid lines
    x = (box[0]//step + 1)*step
    while x < box[2]:
        px = (x-box[0])*sx
        d.line([(px,0),(px,tile)], fill=(255,60,60), width=1)
        d.text((px+2,2), str(x), fill=(255,60,60))
        x += step
    y = (box[1]//step + 1)*step
    while y < box[3]:
        py = (y-box[1])*sy
        d.line([(0,py),(tile,py)], fill=(60,120,255), width=1)
        d.text((2,py+2), str(y), fill=(60,120,255))
        y += step
    return crop

sheet = Image.new('RGB', (tile*2+gap, tile*2+gap), (20,20,20))
sheet.paste(make_tile((0,0,cw,ch),0,0), (0,0))                       # TL
sheet.paste(make_tile((W-cw,0,W,ch),0,0), (tile+gap,0))              # TR
sheet.paste(make_tile((0,H-ch,cw,H),0,0), (0,tile+gap))             # BL
sheet.paste(make_tile((W-cw,H-ch,W,H),0,0), (tile+gap,tile+gap))    # BR
sheet.save(out)
print("wrote", out, "corner crop frac", frac, "full size", (W,H))
