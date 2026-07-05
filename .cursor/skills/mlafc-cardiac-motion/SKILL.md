---
name: mlafc-cardiac-motion
description: >-
  Produces Midnight Atlas cardiac education animations for Mumbai London AF Clinic.
  Two-step Higgsfield pipeline: GPT Image 2 schematic still, then Seedance 2.0
  image-to-video with heartbeat/ECG pulse motion. Use when creating condition or
  procedure diagrams, medical explainer loops, Seedance animations, or cardiac
  visuals for the mlafc site.
---

# MLAF Cardiac Motion

Professional schematic cardiac animations for the Mumbai London AF Clinic site.
**Never photorealistic surgery.** Schematic diagrams only.

## Before every batch

Read [style-bible.md](style-bible.md). All prompts must use those hex values and motifs.

## MCP workflow (mandatory order)

### 0. Folder structure

| Stage | Path |
|---|---|
| Base reference | `reference/conditions/base/{slug}.png` |
| Converted still | `public/conditions/converted/{slug}.png` |
| Animated video | `public/conditions/animated/{slug}.mp4` |

Generate the full converted still set from base references before animating any condition.

### 1. Discover model constraints

Call `models_explore` with `action: get` for `gpt_image_2` and `seedance_2_0`.
Note `aspect_ratios`, `durations`, `medias[].roles`.

Preflight credits: `generate_image` / `generate_video` with `get_cost: true`.

### 2. Convert base reference (GPT Image 2 + reference images)

Upload base image via `media_upload` → PUT → `media_confirm`.

For conditions after AF, attach three references:
1. `public/conditions/converted/af.png` — style master (palette, heart diagram, layout)
2. `reference/conditions/base/{slug}.png` — condition content source
3. `reference/conditions/base/af-animated-frame.png` — optional motion feel (keep cream palette from #1, not dark tones from frame)

```
generate_image:
  model: gpt_image_2
  aspect_ratio: "16:9"
  medias:
    - value: <af_converted_media_id>
      role: image
    - value: <condition_base_media_id>
      role: image
    - value: <af_animated_frame_media_id>
      role: image
  prompt: <Match AF style exactly, swap condition-specific ECG and heart signals>
```

Save to `public/conditions/converted/{slug}.png`. QC still before video.

### 3. Animate converted still (Seedance 2.0)

```
generate_video:
  model: seedance_2_0
  duration: 8-10
  aspect_ratio: "16:9"
  medias:
    - value: <image_job_id>
      role: start_image
  prompt: <MOTION_PROMPT + style lock>
```

If `ip_detected`: call `reveal_generation` after user confirms rights.

### 4. Site integration

- Video: `public/conditions/animated/{slug}.mp4`
- Poster: `public/conditions/converted/{slug}.png`
- Data: `videoSrc` + `posterSrc` in `data/conditions.ts`

## Style lock (append to all prompts)

```
Midnight Atlas medical education style. Warm porcelain background #F7F5F1.
Petrol-navy line art #122B3A. Brass accent #B08D3E for ECG pulse and highlights.
Muted secondary #6B7F8E. Hairline cartographic grid, coordinate tick marks.
Flat schematic vector, no gradients, no photorealism, no 3D render, no blood,
no surgical instruments, no operating theatre, no human skin tissue.
Calm, serious, trustworthy. Generous whitespace.
```

## Quality checklist

- [ ] Schematic only, not photorealistic
- [ ] Palette matches style bible
- [ ] Motion subtle and loop-friendly
- [ ] Clinical sign-off on still before video

## Additional resources

- [style-bible.md](style-bible.md)
- [prompt-templates.md](prompt-templates.md)
