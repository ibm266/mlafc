import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { RelatedPublications } from '@/components/conditions/RelatedPublications';
import publicationsJson from '@/data/publications.json';
import type { Publication } from '@/data/types';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';

const pubs = publicationsJson as Publication[];
const laao = ['pub24', 'pub21', 'pub38', 'pub39'].map((id) => pubs.find((p) => p.id === id)!);

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

function open() {
  const toggle = screen.getByRole('button', { name: /related publications/i });
  fireEvent.click(toggle);
  return toggle;
}

test('starts folded, then opens to a gallery of plain-language cards', () => {
  render(<RelatedPublications topic="left atrial appendage occlusion" publications={laao} />);
  const toggle = screen.getByRole('button', { name: /related publications/i });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByText('4 papers')).toBeInTheDocument();
  expect(screen.queryByRole('article')).toBeNull();
  expect(screen.queryByRole('link')).toBeNull();

  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('region', { name: /papers on left atrial appendage occlusion/i })).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(4);

  // Each card leads with the plain name, keeps the published title in small
  // print, explains the paper, and links out in a new tab.
  expect(screen.getByRole('heading', { level: 4, name: laao[0].plainTitle })).toBeInTheDocument();
  expect(screen.getByText(laao[0].title)).toBeInTheDocument();
  expect(screen.getByText(laao[0].summary)).toBeInTheDocument();
  const links = screen.getAllByRole('link', { name: /read paper/i });
  expect(links.map((link) => link.getAttribute('href'))).toEqual(laao.map((p) => p.url));
  expect(links[0]).toHaveAttribute('target', '_blank');
});

test('keeps the data order, so the most reassuring paper leads', () => {
  render(<RelatedPublications topic="LAAO" publications={laao} />);
  open();
  const headings = screen.getAllByRole('heading', { level: 4 }).map((heading) => heading.textContent);
  expect(headings).toEqual(laao.map((p) => p.plainTitle));
});

test('pages the gallery three at a time', () => {
  render(<RelatedPublications topic="LAAO" publications={laao} />);
  open();
  expect(screen.getByRole('tablist', { name: /papers on LAAO pages/i })).toBeInTheDocument();
  expect(screen.getAllByRole('tab')).toHaveLength(2);
});

test('folds back up and hides its links again', () => {
  render(<RelatedPublications topic="LAAO" publications={laao} />);
  const toggle = open();
  expect(screen.getAllByRole('link', { name: /read paper/i })).toHaveLength(4);
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('link')).toBeNull();
});

test('renders nothing without papers', () => {
  const { container } = render(<RelatedPublications topic="LAAO" publications={[]} />);
  expect(container).toBeEmptyDOMElement();
});

test('has no axe violations when open', async () => {
  const { container } = render(<RelatedPublications topic="LAAO" publications={laao} />);
  open();
  expect(await axe(container)).toHaveNoViolations();
});
