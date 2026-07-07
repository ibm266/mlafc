import testimonials from '@/data/testimonials.json';

test('28 testimonials with exact category counts', () => {
  expect(testimonials).toHaveLength(28);
  const count = (c: string) => testimonials.filter((t) => t.category === c).length;
  expect(count('hospital')).toBe(8);
  expect(count('patient')).toBe(8);
  expect(count('peer')).toBe(6);
  expect(count('news')).toBe(6);
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
  expect(hosp1.quote).toContain('exceptional expertise in electrophysiology');
  expect(hosp1.letter!.org).toBe('Post Graduate Institute of Medical Education and Research, Chandigarh');
  const pat1 = testimonials.find((t) => t.id === 'pat1')!;
  expect(pat1.quote).toContain('stubborn Atrial Fibrillation');
  expect(pat1.detail).toContain('Top Doctors');
  const news1 = testimonials.find((t) => t.id === 'news1')!;
  expect(news1.masthead).toBe('Health Dialogues');
});
