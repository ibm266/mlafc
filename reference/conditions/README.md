# Condition animation assets

Three-stage pipeline for uniform condition diagrams.

## Folders

| Stage | Path | Purpose |
|---|---|---|
| Base | `reference/conditions/base/` | Source reference images (clinical diagrams, etc.) |
| Converted | `public/conditions/converted/` | Midnight Atlas stills from GPT Image 2 |
| Animated | `public/conditions/animated/` | Seedance 2.0 loops from converted stills |

## Workflow

1. Add base reference to `base/{condition}.png`
2. Upload to Higgsfield, convert with `gpt_image_2` + reference image
3. QC converted still against style bible (all conditions should match)
4. Animate converted still with `seedance_2_0` (fixed camera, no zoom)
5. Wire paths in `data/conditions.ts`

## AF (first)

- Base: `base/af-cleveland-clinic.png`
- Converted: `converted/af.png`
- Animated: `animated/af.mp4`

## Atrial flutter

- Base: `base/atrial-flutter.png`
- Style refs: `converted/af.png` + `base/af-animated-frame.png`
- Converted: `converted/atrial-flutter.png`
- Animated: `animated/atrial-flutter.mp4`
