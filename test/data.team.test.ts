import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { teamMembers } from '@/data/team';

const ROOT = join(import.meta.dirname, '..');

test('both Mumbai consultants are present, senior first', () => {
  expect(teamMembers.map((m) => m.id)).toEqual(['darshan-jhala', 'malav-jhala']);
});

test('every team member is complete and well formed', () => {
  const ids = new Set<string>();

  for (const member of teamMembers) {
    expect(member.id).toMatch(/^[a-z0-9-]+$/);
    expect(ids.has(member.id)).toBe(false);
    ids.add(member.id);

    expect(member.name.startsWith('Dr ')).toBe(true);
    expect(member.postnominals).toContain('MB BS');
    expect(member.role.length).toBeGreaterThan(10);
    expect(member.excerpt.length).toBeGreaterThan(80);

    expect(member.bio.length).toBeGreaterThanOrEqual(3);
    for (const paragraph of member.bio) expect(paragraph.length).toBeGreaterThan(40);

    expect(member.afFocus.length).toBeGreaterThanOrEqual(2);
    for (const paragraph of member.afFocus) expect(paragraph.length).toBeGreaterThan(40);

    expect(member.appointments.length).toBeGreaterThanOrEqual(1);
    expect(member.selectedWork.length).toBeGreaterThanOrEqual(4);
    for (const work of member.selectedWork) {
      expect(work.title.length).toBeGreaterThan(10);
      expect(work.detail).toMatch(/\d{4}/);
    }
  }
});

test('training runs most recent first and names an institution', () => {
  for (const member of teamMembers) {
    expect(member.training.length).toBeGreaterThanOrEqual(3);

    const years = member.training.map((entry) => Number(entry.period.slice(-4)));
    expect(years).toEqual([...years].sort((a, b) => b - a));

    for (const entry of member.training) {
      expect(entry.qualification.length).toBeGreaterThan(2);
      expect(entry.institution.length).toBeGreaterThan(10);
    }
  }
});

test('every portrait exists on disk with real dimensions and alt text', () => {
  for (const member of teamMembers) {
    const { photo } = member;
    expect(photo.src.startsWith('/images/team/')).toBe(true);
    expect(photo.width).toBeGreaterThan(0);
    expect(photo.height).toBeGreaterThan(0);
    expect(photo.alt.length).toBeGreaterThan(20);
    // The alt text describes the photograph rather than repeating the caption.
    expect(photo.alt).toContain(member.name);

    const filePath = join(ROOT, 'public', photo.src);
    expect(existsSync(filePath), `missing portrait for ${member.id}: ${photo.src}`).toBe(true);
  }
});

test('no outcome claims that would breach the GMC advertising guidance', () => {
  const prose = teamMembers
    .flatMap((m) => [m.excerpt, ...m.bio, ...m.afFocus, m.interests ?? ''])
    .join(' ')
    .toLowerCase();

  for (const banned of [
    'safer than',
    'better than',
    'more effective than',
    'superior',
    'safest',
    'best in',
    'guarantee',
    'cure',
  ]) {
    expect(prose).not.toContain(banned);
  }
});
