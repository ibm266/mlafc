/** SVG path builders for schematic ECG strips (Midnight Atlas). */

function fibrillationSegment(x0: number, x1: number, y: number, amplitude: number, steps: number): string {
  let d = '';
  const step = (x1 - x0) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = x0 + step * i;
    const wobble =
      Math.sin(i * 2.7 + x0 * 0.04) * amplitude * 0.55 +
      Math.sin(i * 5.1 + x0 * 0.09) * amplitude * 0.35 +
      Math.sin(i * 8.3) * amplitude * 0.1;
    d += ` L ${x.toFixed(1)} ${(y + wobble).toFixed(1)}`;
  }
  return d;
}

function appendQrs(d: string, x: number, y: number, width: number): string {
  const q = x + width * 0.08;
  const r = x + width * 0.22;
  const s = x + width * 0.36;
  const end = x + width;
  return (
    d +
    ` L ${q.toFixed(1)} ${(y + 2).toFixed(1)}` +
    ` L ${r.toFixed(1)} ${(y - 26).toFixed(1)}` +
    ` L ${s.toFixed(1)} ${(y + 9).toFixed(1)}` +
    ` L ${end.toFixed(1)} ${y.toFixed(1)}`
  );
}

function normalBeat(x: number, y: number, width: number): string {
  const p2 = x + width * 0.18;
  const p3 = x + width * 0.26;
  const pr = x + width * 0.34;
  const t2 = x + width * 0.7;
  const t3 = x + width * 0.82;
  const end = x + width;

  let d = ` L ${(x + width * 0.1).toFixed(1)} ${y.toFixed(1)}`;
  d += ` Q ${p2.toFixed(1)} ${(y - 4).toFixed(1)} ${p3.toFixed(1)} ${y.toFixed(1)}`;
  d += ` L ${pr.toFixed(1)} ${y.toFixed(1)}`;
  d = appendQrs(d, pr, y, width * 0.22);
  d += ` L ${(x + width * 0.58).toFixed(1)} ${y.toFixed(1)}`;
  d += ` Q ${t2.toFixed(1)} ${(y - 5).toFixed(1)} ${t3.toFixed(1)} ${y.toFixed(1)}`;
  d += ` L ${end.toFixed(1)} ${y.toFixed(1)}`;
  return d;
}

/**
 * SVT beat: narrow-complex tachycardia — regular, fast, often no visible P waves.
 * Clean flat baseline between beats (unlike AF/flutter).
 */
function svtBeat(x: number, y: number, width: number): string {
  const qrsStart = x + width * 0.12;
  const t2 = x + width * 0.62;
  const t3 = x + width * 0.76;
  const end = x + width;

  let d = ` L ${qrsStart.toFixed(1)} ${y.toFixed(1)}`;
  d = appendQrs(d, qrsStart, y, width * 0.2);
  d += ` L ${(x + width * 0.48).toFixed(1)} ${y.toFixed(1)}`;
  d += ` Q ${t2.toFixed(1)} ${(y - 4).toFixed(1)} ${t3.toFixed(1)} ${y.toFixed(1)}`;
  d += ` L ${end.toFixed(1)} ${y.toFixed(1)}`;
  return d;
}

/** Regular narrow-complex tachycardia (~150–220 bpm class appearance). */
export function buildSvtRhythmPath(width: number, y: number): string {
  const beatCount = 9;
  const beatWidth = width / beatCount;
  let d = `M 0 ${y}`;
  for (let i = 0; i < beatCount; i++) {
    d += svtBeat(i * beatWidth, y, beatWidth);
  }
  return d;
}

/** Premature ectopic beat — slightly taller QRS (pounding/thump). */
function appendEctopicQrs(d: string, x: number, y: number, width: number): string {
  const q = x + width * 0.08;
  const r = x + width * 0.22;
  const s = x + width * 0.36;
  const end = x + width;
  return (
    d +
    ` L ${q.toFixed(1)} ${(y + 2).toFixed(1)}` +
    ` L ${r.toFixed(1)} ${(y - 30).toFixed(1)}` +
    ` L ${s.toFixed(1)} ${(y + 9).toFixed(1)}` +
    ` L ${end.toFixed(1)} ${y.toFixed(1)}`
  );
}

/**
 * Palpitations: mostly normal sinus with an early ectopic beat and compensatory pause.
 * Symptom pattern — "skipped or extra beat" — not a single diagnosis.
 */
export function buildPalpitationsRhythmPath(width: number, y: number): string {
  const beatWidth = width / 5;
  let d = `M 0 ${y}`;

  d += normalBeat(0, y, beatWidth);
  d += normalBeat(beatWidth, y, beatWidth);

  const ectopicX = beatWidth * 2.05;
  const ectopicW = beatWidth * 0.38;
  d += ` L ${ectopicX.toFixed(1)} ${y.toFixed(1)}`;
  d = appendEctopicQrs(d, ectopicX, y, ectopicW);

  const pauseEnd = beatWidth * 3.35;
  d += ` L ${pauseEnd.toFixed(1)} ${y.toFixed(1)}`;

  d += normalBeat(beatWidth * 3.2, y, beatWidth * 0.9);
  d += normalBeat(beatWidth * 4.05, y, beatWidth * 0.95);

  return d;
}

/**
 * Bradycardia: regular sinus rhythm at a slow rate (<60 bpm class appearance).
 * Same beat shape as normal, wider spacing (~3 beats vs 5).
 */
export function buildBradycardiaRhythmPath(width: number, y: number): string {
  const beatCount = 3;
  const beatWidth = width / beatCount;
  let d = `M 0 ${y}`;
  for (let i = 0; i < beatCount; i++) {
    d += normalBeat(i * beatWidth, y, beatWidth);
  }
  return d;
}

/**
 * Blackouts: normal rhythm interrupted by a prolonged pause (sinus pause / drop in output).
 * Symptom pattern linked to reduced blood flow when the heart pauses.
 */
export function buildBlackoutsRhythmPath(width: number, y: number): string {
  const beatWidth = width / 5;
  let d = `M 0 ${y}`;

  d += normalBeat(0, y, beatWidth);
  d += normalBeat(beatWidth, y, beatWidth);

  const pauseStart = beatWidth * 2.15;
  const pauseEnd = beatWidth * 3.9;
  d += ` L ${pauseStart.toFixed(1)} ${y.toFixed(1)}`;
  d += ` L ${pauseEnd.toFixed(1)} ${y.toFixed(1)}`;

  d += normalBeat(pauseEnd, y, beatWidth * 1.05);

  return d;
}

/** Regular sinus rhythm across the strip. */
export function buildNormalRhythmPath(width: number, y: number, beatCount = 5): string {
  const beatWidth = width / beatCount;
  let d = `M 0 ${y}`;
  for (let i = 0; i < beatCount; i++) {
    d += normalBeat(i * beatWidth, y, beatWidth);
  }
  return d;
}

/** Irregular AF rhythm with fibrillatory baseline between QRS complexes. */
export function buildAfRhythmPath(width: number, y: number): string {
  const qrsPositions = [0, 0.17, 0.38, 0.52, 0.74, 0.92];
  let d = `M 0 ${y}`;

  for (let i = 0; i < qrsPositions.length - 1; i++) {
    const x0 = qrsPositions[i]! * width;
    const x1 = qrsPositions[i + 1]! * width;
    const segmentWidth = x1 - x0;
    const qrsStart = x0 + segmentWidth * 0.2;

    d += fibrillationSegment(x0, qrsStart, y, 3.5, 10);
    d = appendQrs(d, qrsStart, y, segmentWidth * 0.55);

    if (i < qrsPositions.length - 2) {
      const afterQrs = qrsStart + segmentWidth * 0.55;
      d += fibrillationSegment(afterQrs, x1, y, 4, 12);
    }
  }

  d += ` L ${width} ${y}`;
  return d;
}

/** Regular sawtooth F-waves with evenly spaced QRS complexes (classic flutter). */
function appendSawtooth(
  d: string,
  x0: number,
  x1: number,
  y: number,
  teeth: number,
  amplitude: number,
): string {
  const toothW = (x1 - x0) / teeth;
  for (let t = 0; t < teeth; t++) {
    const base = x0 + t * toothW;
    d += ` L ${(base + toothW * 0.5).toFixed(1)} ${(y - amplitude).toFixed(1)}`;
    d += ` L ${(base + toothW).toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export function buildAtrialFlutterRhythmPath(width: number, y: number): string {
  // ~2× normal QRS density (5 beats → 10) with dense sawtooth F-waves (~250–350 atrial rate)
  const qrsCount = 10;
  const qrsSpan = width * 0.03;
  let d = `M 0 ${y}`;
  let x = 0;

  for (let i = 0; i < qrsCount; i++) {
    const qrsStart = ((i + 1) * width) / qrsCount - qrsSpan * 0.55;
    const gap = qrsStart - x;
    if (gap > 3) {
      const teeth = Math.max(5, Math.round(gap / 7));
      d = appendSawtooth(d, x, qrsStart, y, teeth, 5);
    }
    d = appendQrs(d, qrsStart, y, qrsSpan);
    x = qrsStart + qrsSpan;
  }

  const tail = width - x;
  if (tail > 3) {
    d = appendSawtooth(d, x, width, y, Math.max(3, Math.round(tail / 7)), 5);
  } else {
    d += ` L ${width} ${y}`;
  }

  return d;
}

/** Count schematic QRS complexes via the S-wave trough coordinate. */
export function countQrsComplexes(path: string, baselineY: number): number {
  const sLevel = (baselineY + 9).toFixed(1);
  return (path.match(new RegExp(`L [\\d.]+ ${sLevel.replace('.', '\\.')}`, 'g')) ?? []).length;
}

export type EcgVariant =
  | 'af'
  | 'atrial-flutter'
  | 'svt'
  | 'palpitations'
  | 'blackouts'
  | 'bradycardia';

/** Brief pause after both strips finish before the loop restarts (~ms at LOOP_MS). */
export const ECG_COMPLETE_HOLD = 0.035;

export const ECG_VARIANTS: Record<
  EcgVariant,
  {
    label: string;
    buildAbnormal: (width: number, y: number) => string;
    /** Loop fraction where abnormal draw phase ends (shorter = faster dot travel). */
    abnormalPhaseEnd: number;
  }
> = {
  af: { label: 'AF', buildAbnormal: buildAfRhythmPath, abnormalPhaseEnd: 0.9 },
  'atrial-flutter': {
    label: 'Atrial flutter',
    buildAbnormal: buildAtrialFlutterRhythmPath,
    abnormalPhaseEnd: 0.8,
  },
  svt: {
    label: 'SVT',
    buildAbnormal: buildSvtRhythmPath,
    abnormalPhaseEnd: 0.82,
  },
  palpitations: {
    label: 'Palpitations',
    buildAbnormal: buildPalpitationsRhythmPath,
    abnormalPhaseEnd: 0.9,
  },
  blackouts: {
    label: 'Pause',
    buildAbnormal: buildBlackoutsRhythmPath,
    abnormalPhaseEnd: 0.9,
  },
  bradycardia: {
    label: 'Bradycardia',
    buildAbnormal: buildBradycardiaRhythmPath,
    abnormalPhaseEnd: 0.95,
  },
};

export const ECG_LAYOUT = {
  viewWidth: 640,
  viewHeight: 360,
  stripPaddingX: 48,
  stripWidth: 544,
  normalY: 118,
  abnormalY: 248,
} as const;
