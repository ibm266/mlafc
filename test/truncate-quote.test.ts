import { truncateQuote } from '@/lib/truncate-quote';

test('truncateQuote leaves short quotes unchanged', () => {
  const quote = 'A short review.';
  expect(truncateQuote(quote)).toEqual({ text: quote, truncated: false });
});

test('truncateQuote shortens long quotes at a word boundary', () => {
  const quote =
    'I was diagnosed with atrial fibrillation 3 years ago and despite various medication and treatments including cardio version my situation was not improved. When I approached prof Gupta he suggested to perform an ablation which was successful.';
  const { text, truncated } = truncateQuote(quote, 80);
  expect(truncated).toBe(true);
  expect(text.endsWith('…')).toBe(true);
  expect(text.length).toBeLessThanOrEqual(84);
  expect(quote.startsWith(text.slice(0, -1))).toBe(true);
});
