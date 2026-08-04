# Adding a certificate to the wall

The certifications page (`/certifications`) shows framed certificates on a dark
wall. Clicking a frame opens a dialog with the story behind it. Items are either
a `scan` (a real certificate, restored and set inside an ornate gilt frame, as a
transparent WebP that floats on the wall) or a `plate` (a typeset certificate for
a credential we do not have a scan of yet).

This is the repeatable recipe for adding one. It is optimised so a new item
slots into the wall and the catalogue with no layout work: the salon hang and
the ledger both flow from the data.

## To add a typeset plate (no photo needed)

Add an entry to `data/certifications.ts` with `kind: 'plate'` and no `image`.
That is the whole job. Example:

```ts
{
  id: 'mrcp-2003',
  postnominal: 'MRCP',
  title: 'Membership of the Royal College of Physicians',
  awardingBody: 'Royal College of Physicians',
  location: 'London',
  year: '2003',
  category: 'uk',        // 'india' | 'uk' | 'fellowships' | 'recognition'
  kind: 'plate',
  story: [
    'First paragraph shown in the dialog.',
    'Second paragraph.',
  ],
  meta: 'A short factual line (optional).',
},
```

The `postnominal` is the short label shown under the frame (for example `FRCP`)
and supplies the seal initial. `category` decides which room the item hangs in.
Order within a room follows the array order, so keep entries chronological.

## To add a real certificate (photo)

### 1. Drop the photo in

Put the original photo in `Certificates/` at the repo root. That folder is
git-ignored on purpose: only the small web versions in
`public/images/certificates/` are committed.

Photograph or scan it as square-on and evenly lit as you can. A phone photo at
8 megapixels or more is plenty.

### 2. Restore and export it

The restoration is deterministic. It straightens, crops, white-balances and
gently sharpens, and never repaints text, seals, signatures or faces. It needs
Python with Pillow and numpy (`pip install pillow numpy`).

If the photo is skewed or sits inside a physical frame, first find the four
corners of the document (top-left, top-right, bottom-right, bottom-left) in
source pixels. This helper writes a labelled grid of the four corners:

```bash
python3 scripts/certificates/corner-sheet.py "Certificates/My Cert.jpg" corners.png
```

Then run the restore. If it ends in `.jpg` it also produces the web derivative
(2000 px long edge, under about 350 KB):

```bash
python3 scripts/certificates/restore.py \
  "Certificates/My Cert.jpg" \
  "public/images/certificates/my-cert-2020.jpg" \
  '{"corners":[[TLx,TLy],[TRx,TRy],[BRx,BRy],[BLx,BLy]],"out_w":3600,"out_h":2500}'
```

If the document already fills the frame and is roughly straight, skip corners
and just trim margins instead:

```bash
python3 scripts/certificates/restore.py \
  "Certificates/My Cert.jpg" \
  "public/images/certificates/my-cert-2020.jpg" \
  '{"crop":[0.012,0.015,0.012,0.015]}'
```

Open the output and check it. Every character, seal and signature must match the
original exactly. If the paper is a grey security stock rather than white, add
`"wb": false`. If the photo was taken under a lamp, so the paper carries a
colour cast, a corner shadow or a soft reflection, add `"flatten": 0.85`: it
divides out the lighting and leaves the document itself untouched. If the file
is over the size budget because of heavy paper
texture, add `"grain": 0.4` (edge-preserving smoothing that keeps text crisp).
If the photograph clipped a margin the sheet really has, so the document sits
lopsided in its own paper, give the margin back with `"pad"`, which mirror
tiles the blank paper just inside that edge. Pair it with `"pad_src"` whenever
the clear strip is thinner than the pad, or the mirror drags the printed border
back into the margin as a ghost. Never pad an edge a border or a ribbon
reaches.

All config keys are documented at the top of `scripts/certificates/restore.py`.
Export a full-resolution PNG master here (end the output path in `.png`); you
feed that into the framing step next.

### 3. Set it in an ornate frame (Higgsfield GPT Image, then transparency)

The wall shows each certificate inside a grand gilt frame. The frame is
generated; the certificate itself is never regenerated.

1. Upload the PNG master and run it through GPT Image 2 (model `gpt_image_2`,
   quality `high`) with a prompt that says: place this exact certificate,
   unchanged, inside an ornate gilded frame; do not alter, redraw or re-letter
   any text, seals, signatures or faces; only add the frame. Ask for a flat
   dark charcoal background with no gradient, vignette or cast shadow, so the
   transparency step has a clean field to flood-fill. Pick an aspect ratio
   close to the certificate's. Vary the frame style per certificate (baroque,
   neoclassical fluted, rococo shell, Empire, etc.) so no two match.
2. Review the result at full size against the original. Every character, seal,
   signature and face must be identical. If anything drifted, regenerate.

   Expect body text to survive and **expect small circular seals and crests to
   drift**. GPT Image reliably re-letters the ring text of an institutional
   crest into plausible looking nonsense: the PGIMER crest came back reading
   "HELOAL EDIOKTAI" across two separate generations. It will also silently
   correct a typo that is genuinely printed on the document. Neither is
   acceptable on a credentials page, so do not try to prompt your way out of
   it. Go to step 3.
3. Put the real document back with `scripts/certificates/reinstate.py`. This
   pastes the master into the frame's mount opening, so only the frame is
   generated and every character, seal and signature is the original
   photograph again. Read the opening off a coordinate grid, measured just
   inside the gold inner lip:

   ```bash
   python3 scripts/certificates/reinstate.py \
     framed.png my-cert-master.png my-cert-framed.png \
     '{"rect":[left,top,right,bottom]}'
   ```

   The document is never stretched. Default `pad` mode extends the master's
   outermost pixels to meet the opening, which is right when the master has
   blank margin. If the design bleeds to its edge (a ribbon, a printed border)
   `pad` smears it into streaks, so use `"mode":"fit"` instead, which fits the
   document and fills the leftover band with the frame's own mount colour.
   `"mode":"cover"` centre-crops, and is only safe with generous blank margin.
4. Remove the dark background so the frame floats on the wall. The Higgsfield
   background remover works for most frames; if it eats the ornate frame (it can
   mistake the inner document for the subject), use the deterministic
   `scripts/certificates/frame_transparent.py` instead, which flood-fills the
   flat background from the borders and keeps the whole frame.
5. Export a transparent WebP to `public/images/certificates/{slug}.webp`
   (~2000px long edge). Note its final width and height.

### 4. Add the data entry

Add an entry with `kind: 'scan'` and the `image` block, using the exact width
and height of the final WebP (so the page reserves space and never shifts):

```ts
{
  id: 'my-cert-2020',
  postnominal: 'XYZ',
  title: 'Full credential name',
  awardingBody: 'Awarding institution',
  location: 'City, Country',
  year: '2020',
  category: 'uk',
  kind: 'scan',
  image: {
    src: '/images/certificates/my-cert-2020.webp',
    width: 2000,
    height: 1400,
    alt: 'Plain-language description of the certificate for screen readers.',
  },
  story: [
    'What it is and why it matters, in the site voice.',
  ],
  meta: 'Optional short line.',
  // verify: { label: 'GMC Register', url: 'https://...' },  // if publicly verifiable
},
```

Write real alt text: say what the certificate is, who awarded it and the year.

### 5. Test

```bash
npm test
```

`test/data.certifications.test.ts` checks that every scan entry points at an
image file that actually exists, so a typo in `src` fails the build rather than
shipping a broken image.

## Items held back until the letters arrive

Two credentials are written up but not on the wall. They sit in
`pendingCertifications` at the bottom of `data/certifications.ts`, which nothing
imports, so they render nowhere:

- NHS National Clinical Excellence Award, Bronze (2017)
- Honorary Professor of Cardiology, University of Liverpool (2019)

Both are conferred by letter rather than by certificate, and we do not have
those letters to scan yet. Rather than hang typeset plates with no document
behind them, they wait. The Silver award (2022) was in this list until its
ACCEA letter turned up; it is now a framed scan on the wall.

To put one back, move the entry from `pendingCertifications` into
`certifications`, in year order within the recognition section. If the letter
has been scanned by then, run it through the recipe above and switch the entry
to `kind: 'scan'` with an `image` block. Nothing else needs changing: the wall,
the catalogue and the structured data all flow from the array.

## House rules

- No em dashes anywhere in this repo (see `AGENTS.md`). Use commas, full stops,
  colons or parentheses.
- Keep the wall to authentic documents. Do not generate replica certificates or
  institution crests; a typeset `plate` is the honest stand-in until a real scan
  exists. `acc-young-investigator-2000` is the single logged exception, for the
  reasons recorded against it below.

## Restore configs used for the current scans

These produce the restored, un-framed PNG masters from the originals in
`Certificates/` or `Website Photos/` (step 2). Each master then goes through the
framing and transparency steps (3) to become the `.webp` on the wall. Run each as
`python3 scripts/certificates/restore.py "<source>" "<slug>-master.png" '<config>'`.

- `md-pgimer-1997` from `MD Medicine degree certificate PGIMER 1997.jpg`:
  `{"crop":[0.012,0.018,0.012,0.012],"paper_pct":88,"levels_pct":[0.5,99.5],"denoise_amt":0.35,"sharpen_amt":100}`
- `dnb-nbe-1997` from `DNB certificate 1997.jpg`:
  `{"crop":[0.01,0.012,0.01,0.015],"paper_pct":90,"levels_pct":[0.5,99.6],"denoise_amt":0.32,"sharpen_amt":95,"grain":0.35}`
- `dm-aiims-2000` from `DM Cardiology certificate AIIMS Delhi 2000.jpg`:
  `{"crop":[0.018,0.02,0.016,0.022],"paper_pct":88,"levels_pct":[0.5,99.6],"denoise_amt":0.32,"sharpen_amt":95,"grain":0.15}`
- `cct-pmetb-2006` from `UK Completion of cardiology training certificate 2006.jpg`:
  `{"corners":[[18,208],[3618,176],[3624,2592],[30,2576]],"out_w":3560,"out_h":2380,"wb":false,"levels_pct":[0.6,99.5],"denoise_amt":0.3,"sharpen_amt":88,"grain":0.6}`
- `frcp-2012` from `Fellowship Royal College of Physicians 2012.jpg`:
  `{"crop":[0.008,0.008,0.008,0.008],"wb":false,"levels_pct":[0.8,99.5],"denoise_amt":0.28,"sharpen_amt":80,"grain":0.3}`
- `fesc-2018` from `FESC degree certificate 2018.jpg`:
  `{"corners":[[605,640],[4465,610],[4450,3298],[605,3300]],"out_w":3840,"out_h":2660,"paper_pct":85,"levels_pct":[0.5,99.7],"denoise_amt":0.3,"sharpen_amt":90}`

The ones added later also needed the reinstate step (3), with the mount
opening measured on the generated frame:

- `arrhythmia-alliance-2014` from the award PDF. Render the page first
  (`sips -s format png --resampleWidth 4000`), then restore with everything off,
  since a born-digital PDF needs no correction:
  `{"wb":false,"levels":false,"denoise":false,"sharpen":false}`.
  Reinstate `{"rect":[683,476,2635,1942]}`.
- `acc-young-investigator-2000` from `Website Photos/ACC Young Investigators
  Award 2000.jpg`. A glossy black plaque, so white balance and levels must be
  off or the stone blows out. The corners are the dark engraved face, read just
  inside the cream stone bevel, so the warp lands on the face and no marble
  bleeds in at the edges:
  `{"corners":[[301,474],[2791,392],[2750,3698],[428,3648]],"out_w":2440,"out_h":3253,"wb":false,"levels":false,"denoise_amt":0.25,"sharpen_amt":70}`.
  No second crop pass and no reinstate: see the note below.

  **This is the one item on the wall whose document face is generated rather
  than photographed.** The source is a phone photo taken well off-axis, with
  hard diagonal shadow bands, specular streaks and the photographer's
  silhouette mirrored in the polished stone, and no deterministic step can
  remove a reflection. So GPT Image 2 was asked to re-present the plaque
  square-on and evenly lit as well as to frame it, and the result was kept
  as-is instead of reinstating the master over it, because reinstating would
  put the glare straight back. Every line of the engraving, the flourish and
  the AACIO crest were checked character by character against the master and
  match, ring text included, which is not the usual outcome (see step 3) and is
  why this exception was allowed to stand. If the plaque is ever rephotographed
  square-on under diffuse light, redo it the normal way with a reinstate step.
- `pgimer-appreciation-2025` from `Certificate of Appreciation PGI Chandigarh 2025.jpg`:
  `{"rotate":-0.6,"crop":[0.030,0.035,0.036,0.064],"paper_pct":86,"levels_pct":[0.5,99.5],"denoise_amt":0.3,"sharpen_amt":95}`.
  Reinstate `{"rect":[632,491,2695,1918]}`.
- `mbbs-1994` from `MBBS degree certificate Allahabad 1993.jpg`. The source is a
  phone screenshot of a scanning-app export, not a photograph of the document,
  so the paper is already flattened to near-white and the usual corrections
  would only chew at it. White balance and levels off, light denoise and
  unsharp, and the crop just balances an off-centre text block:
  `{"crop":[62,14,0,0],"wb":false,"levels":false,"denoise_amt":0.22,"sharpen_amt":70}`.
  Reinstate `{"rect":[370,470,1373,1796],"mode":"fit"}`. `fit`, not `pad`,
  because the screenshot is clipped mid-line at the bottom edge and `pad` would
  smear the last date into vertical streaks. Two known defects ride along in the
  source and are visible on the wall: the iOS Live Text button sits over the
  "llor" of "Vice-Chancellor", and the date line below "05th, February, 2026"
  is cut off. Both go away if the physical certificate is ever rephotographed;
  nothing but the master and these two configs would need to change.
- `nhs-silver-2022` from `Website Photos/NHS Silver ACCEA award letter
  2022.jpeg`. A born-digital letter, so every correction is off:
  `{"wb":false,"levels":false,"denoise":false,"sharpen":false}`.
  Reinstate `{"rect":[626,409,2248,2471]}` in the default `pad` mode, which only
  extends the letter's own white margin to meet a slightly taller opening.
  The source is a 630x683 crop of the first page, so the letter is upscaled
  about 1.9x into the frame and reads a little soft next to the other scans, and
  the page ends after "this very significant achievement" with the signature
  block below the crop. Both go away if the full page is ever scanned: only the
  master and the reinstate rect would need to change.
- `aig-appreciation-2025` from `Plaque of Appreciation Hyderabad 2025.jpg`:
  `{"corners":[[845,1015],[3472,977],[3486,4736],[852,4770]],"out_w":2630,"out_h":3760,"paper_pct":84,"levels_pct":[0.5,99.6],"denoise_amt":0.3,"sharpen_amt":90}`,
  then `{"crop":[0.006,0.004,0.032,0.040]}` to clear the physical frame lip.
  Reinstate `{"rect":[604,676,1867,2581],"mode":"fit"}`, because the ribbon
  bleeds to the top edge and `pad` streaks it.
- `facc-2022` from `Fellow American College of Cardiology 2022.jpg`, converted
  from the phone's HEIC first (`sips -s format jpeg -s formatOptions best`).
  Mottled parchment shot under a warm lamp, off axis, with a soft reflection
  across the top right, so this is the first item to use `flatten`. The corners
  are not the sheet, which runs off frame at the left and is clipped at the
  bottom, but the printed gold rule offset outwards by the sheet's own margin,
  which is 88px at the sides and 340px at the top to make room for the seal
  straddling the rule:
  `{"corners":[[78,15],[3666,32],[3665,2774],[43,2764]],"out_w":3607,"out_h":2746,"flatten":0.85,"wb":false,"levels_pct":[0.5,99.6],"denoise_amt":0.3,"sharpen_amt":90,"pad":[0,0,0,64],"pad_src":[0,0,0,18]}`.
  The photo cut about a quarter inch off the foot of the sheet, so the `pad`
  puts the bottom margin back from the 18px of clear paper below the rule.
  Reinstate `{"rect":[655,527,2659,1952],"mode":"fit"}`. `fit`, not `pad`,
  because GPT Image cut the mount window wider than the sheet and `pad` would
  stretch the paper margins sideways into streaks; `fit` keeps the sheet at its
  true 11 by 8.5 shape and fills the leftover with the mount's own cream.
  Exported with `frame_transparent.py ... 42 2000 60`: the carved laurel frame
  is dense enough that the default quality lands well over the size of every
  other file on the wall.
