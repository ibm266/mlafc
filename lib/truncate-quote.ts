const DEFAULT_MAX_LENGTH = 160;

export function truncateQuote(
  quote: string,
  maxLength = DEFAULT_MAX_LENGTH,
): { text: string; truncated: boolean } {
  if (quote.length <= maxLength) {
    return { text: quote, truncated: false };
  }

  const slice = quote.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice;

  return { text: `${cut.trimEnd()}…`, truncated: true };
}

export const QUOTE_PREVIEW_LENGTH = DEFAULT_MAX_LENGTH;
