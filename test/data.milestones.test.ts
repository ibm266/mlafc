import { milestones } from '@/data/milestones';
import { faqs } from '@/data/faqs';
import { citations } from '@/data/citations';

test('timeline milestones covering 1988-2022 plus separate finale', () => {
  expect(milestones).toHaveLength(11);
  expect(milestones.map((m) => m.markerYear)).toEqual([
    '1988',
    '1994',
    '2000',
    '2006',
    '2009',
    '2012',
    '2014',
    '2017',
    '2019',
    '2022',
    '2022-india',
  ]);
  expect(milestones[0].yearLabel).toBe('1988');
  expect(milestones[0].meta).toBe('MB BS qualified, 1994');
  expect(milestones[7].yearLabel).toBe('2017');
  expect(milestones[7].meta).toBe('National Bronze Award, 2017');
  expect(milestones[9].meta).toBe('National Silver Award, 2022');
  for (const m of milestones) {
    expect(m.title.length).toBeGreaterThan(3);
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

test('citations are numbered with descriptive text', () => {
  expect(citations.length).toBeGreaterThanOrEqual(4);
  citations.forEach((c, i) => expect(c.id).toBe(i + 1));
  for (const c of citations) expect(c.text.length).toBeGreaterThan(20);
});
