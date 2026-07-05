import { describe, expect, it } from 'vitest';
import {
  buildAfRhythmPath,
  buildAtrialFlutterRhythmPath,
  buildBlackoutsRhythmPath,
  buildBradycardiaRhythmPath,
  buildNormalRhythmPath,
  buildPalpitationsRhythmPath,
  buildSvtRhythmPath,
  countQrsComplexes,
} from '@/lib/ecg/paths';

const WIDTH = 544;
const Y = 248;

describe('ecg paths', () => {
  it('builds normal rhythm path', () => {
    const path = buildNormalRhythmPath(WIDTH, 118);
    expect(path).toMatch(/^M 0 118/);
    expect(path.length).toBeGreaterThan(100);
  });

  it('builds AF path with irregular segments', () => {
    const path = buildAfRhythmPath(WIDTH, Y);
    expect(path).toMatch(/^M 0 248/);
    expect(path).toContain('L');
  });

  it('builds atrial flutter path with dense sawtooth pattern', () => {
    const path = buildAtrialFlutterRhythmPath(WIDTH, Y);
    expect(path).toMatch(/^M 0 248/);
    const segments = (path.match(/ L [\d.]+ [\d.]+/g) ?? []).length;
    expect(segments).toBeGreaterThan(80);
  });

  it('flutter QRS density is roughly 2× normal', () => {
    const normal = countQrsComplexes(buildNormalRhythmPath(WIDTH, 118), 118);
    const flutter = countQrsComplexes(buildAtrialFlutterRhythmPath(WIDTH, Y), Y);
    expect(normal).toBe(5);
    expect(flutter).toBe(10);
    expect(flutter / normal).toBeGreaterThanOrEqual(1.8);
  });

  it('builds SVT path with regular narrow complexes', () => {
    const path = buildSvtRhythmPath(WIDTH, Y);
    expect(path).toMatch(/^M 0 248/);
    expect(countQrsComplexes(path, Y)).toBe(9);
  });

  it('SVT is faster than normal but without sawtooth density of flutter', () => {
    const normal = countQrsComplexes(buildNormalRhythmPath(WIDTH, 118), 118);
    const svt = countQrsComplexes(buildSvtRhythmPath(WIDTH, Y), Y);
    const flutter = countQrsComplexes(buildAtrialFlutterRhythmPath(WIDTH, Y), Y);
    expect(svt).toBeGreaterThan(normal);
    expect(svt).toBeLessThan(flutter);
  });

  it('builds palpitations path with ectopic beat pattern', () => {
    const path = buildPalpitationsRhythmPath(WIDTH, Y);
    expect(path).toMatch(/^M 0 248/);
    const qrsCount = countQrsComplexes(path, Y);
    expect(qrsCount).toBeGreaterThanOrEqual(5);
    expect(qrsCount).toBeLessThanOrEqual(7);
    expect(path).toContain(`${(Y - 30).toFixed(1)}`);
  });

  it('builds bradycardia path slower than normal', () => {
    const normal = countQrsComplexes(buildNormalRhythmPath(WIDTH, 118), 118);
    const brady = countQrsComplexes(buildBradycardiaRhythmPath(WIDTH, Y), Y);
    expect(normal).toBe(5);
    expect(brady).toBe(3);
  });

  it('builds blackouts path with prolonged pause', () => {
    const path = buildBlackoutsRhythmPath(WIDTH, Y);
    expect(path).toMatch(/^M 0 248/);
    expect(countQrsComplexes(path, Y)).toBe(3);
    const flatRuns = path.match(/ L [\d.]+ 248\.0/g) ?? [];
    expect(flatRuns.length).toBeGreaterThan(4);
  });
});
