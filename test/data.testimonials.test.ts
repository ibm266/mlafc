import testimonials from '@/data/testimonials.json';

test('24 testimonials with exact category counts', () => {
  expect(testimonials).toHaveLength(24);
  const count = (c: string) => testimonials.filter((t) => t.category === c).length;
  expect(count('hospital')).toBe(6);
  expect(count('patient')).toBe(8);
  expect(count('peer')).toBe(6);
  expect(count('news')).toBe(4);
});

test('every hospital testimonial carries a full letter', () => {
  for (const t of testimonials.filter((t) => t.category === 'hospital')) {
    expect(t.letter).toBeDefined();
    expect(t.letter!.body.length).toBeGreaterThanOrEqual(2);
    expect(t.letter!.org.length).toBeGreaterThan(3);
    expect(t.letter!.sigName.length).toBeGreaterThan(2);
  }
});

test('news testimonials carry masthead, date and headline', () => {
  for (const t of testimonials.filter((t) => t.category === 'news')) {
    expect(t.masthead).toBeTruthy();
    expect(t.date).toBeTruthy();
    expect(t.headline).toBeTruthy();
  }
});

test('spot-check ported content is verbatim', () => {
  const hosp1 = testimonials.find((t) => t.id === 'hosp1')!;
  expect(hosp1.quote).toContain('most reliable and skilled electrophysiologists');
  expect(hosp1.letter!.org).toBe('Liverpool Heart and Chest Hospital NHS Foundation Trust');
  const pat1 = testimonials.find((t) => t.id === 'pat1')!;
  expect(pat1.quote).toContain('just stress');
  const news1 = testimonials.find((t) => t.id === 'news1')!;
  expect(news1.masthead).toBe('The Indian Express');
});
