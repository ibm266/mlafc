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

### 0. Discover model constraints

Call `models_explore` with `action: get` for `gpt_image_2` and `seedance_2_0`.
Note `aspect_ratios`, `durations`, `medias[].roles`.

Preflight credits: `generate_image` / `generate_video` with `get_cost: true`.

### 1. Generate schematic still (GPT Image 2)

```
generate_image:
  model: gpt_image_2
  aspect_ratio: "16:9"
  prompt: <STILL_PROMPT + style lock>
```

Poll `job_status` until `completed`. QC still before video.

### 2. Animate still (Seedance 2.0)

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

### 3. Site integration

- Video: `public/videos/conditions/{slug}.mp4`
- Poster: `public/images/conditions/{slug}-poster.jpg`
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
