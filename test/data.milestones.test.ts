import { milestones } from '@/data/milestones';
import { faqs } from '@/data/faqs';
import { citations } from '@/data/citations';

test('10 milestones covering 1988-2026', () => {
  expect(milestones).toHaveLength(10);
  expect(milestones.map((m) => m.markerYear)).toEqual([
    '1988', '2000', '2007', '2009', '2012', '2014', '2017', '2022', '2024', '2026',
  ]);
  expect(milestones[0].yearLabel).toBe('1988 - 1994');
  expect(milestones[0].meta).toBe('MB BS qualified, 1994');
  for (const m of milestones) {
    expect(m.title.length).toBeGreaterThan(3);
    expect(m.body.length).toBeGreaterThan(40);
    expect(m.photoTitle.length).toBeGreaterThan(2);
    expect(m.photoCaption.length).toBeGreaterThan(20);
  }
});

test('6 plain-language FAQs, none empty', () => {
  expect(faqs).toHaveLength(6);
  for (const f of faqs) {
    expect(f.question.endsWith('?')).toBe(true);
    expect(f.answer.length).toBeGreaterThan(60);
  }
});

test('citations are numbered and marked for verification', () => {
  expect(citations.length).toBeGreaterThanOrEqual(4);
  citations.forEach((c, i) => expect(c.id).toBe(i + 1));
  for (const c of citations) expect(c.text).toContain('[CITATION - verify]');
});
