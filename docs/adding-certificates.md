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
`"wb": false`. If the file is over the size budget because of heavy paper
texture, add `"grain": 0.4` (edge-preserving smoothing that keeps text crisp).
All config keys are documented at the top of `scripts/certificates/restore.py`.
Export a full-resolution PNG master here (end the output path in `.png`); you
feed that into the framing step next.

### 3. Set it in an ornate frame (Higgsfield GPT Image, then transparency)

The wall shows each certificate inside a grand gilt frame. The frame is
generated; the certificate itself is never regenerated.

1. Upload the PNG master and run it through GPT Image 2 (model `gpt_image_2`,
   quality `high`) with a prompt that says: place this exact certificate,
   unchanged, inside an ornate gilded frame; do not alter, redraw or re-letter
   any text, seals, signatures or faces; only add the frame. Pick an aspect
   ratio close to the certificate's. Vary the frame style per certificate
   (baroque, neoclassical fluted, rococo shell, etc.) so no two match.
2. Review the result at full size against the original. Every character, seal,
   signature and face must be identical. If anything drifted, regenerate.
3. Remove the dark background so the frame floats on the wall. The Higgsfield
   background remover works for most frames; if it eats the ornate frame (it can
   mistake the inner document for the subject), use the deterministic
   `scripts/certificates/frame_transparent.py` instead, which flood-fills the
   flat background from the borders and keeps the whole frame.
4. Export a transparent WebP to `public/images/certificates/{slug}.webp`
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

## House rules

- No em dashes anywhere in this repo (see `AGENTS.md`). Use commas, full stops,
  colons or parentheses.
- Keep the wall to authentic documents. Do not generate replica certificates or
  institution crests; a typeset `plate` is the honest stand-in until a real scan
  exists.

## Restore configs used for the current six scans

These produce the restored, un-framed PNG masters from the originals in
`Certificates/` (step 2). Each master then goes through the framing and
transparency steps (3) to become the `.webp` on the wall. Run each as
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
