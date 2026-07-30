import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import TeamPage from '@/app/team/page';
import { TeamSection } from '@/components/home/TeamSection';
import { teamMembers } from '@/data/team';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('the home page section introduces both consultants and links onward', () => {
  render(<TeamSection />);

  expect(screen.getByRole('heading', { name: /meet the rest of the team/i })).toBeInTheDocument();
  // Professor Gupta stays the principal; the others cover the gaps.
  expect(screen.getByText(/performs every procedure himself/i)).toBeInTheDocument();

  for (const member of teamMembers) {
    expect(screen.getByRole('heading', { name: member.name })).toBeInTheDocument();
    expect(screen.getByAltText(member.photo.alt)).toBeInTheDocument();
  }

  const profileLinks = screen.getAllByRole('link', { name: /read the full profile/i });
  expect(profileLinks.map((link) => link.getAttribute('href'))).toEqual(
    teamMembers.map((member) => `/team#${member.id}`),
  );
  expect(screen.getByRole('link', { name: /meet the whole team/i })).toHaveAttribute('href', '/team');
});

test('the team page leads with Professor Gupta and then profiles both consultants', () => {
  render(<TeamPage />);

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/somebody is still watching/i);
  expect(screen.getByRole('heading', { name: /professor dhiraj gupta/i })).toBeInTheDocument();

  for (const member of teamMembers) {
    expect(screen.getByRole('heading', { name: member.name })).toBeInTheDocument();
    expect(screen.getByText(member.postnominals)).toBeInTheDocument();
    expect(screen.getByAltText(member.photo.alt)).toBeInTheDocument();

    // The anchor each home-page card points at has to exist on this page.
    expect(document.getElementById(member.id)).not.toBeNull();
  }

  // Every named appointment and qualification is on the page, in full.
  for (const member of teamMembers) {
    const section = screen.getByRole('region', { name: member.name });
    for (const appointment of member.appointments) {
      expect(within(section).getByText(appointment)).toBeInTheDocument();
    }
    for (const entry of member.training) {
      expect(within(section).getByText(entry.qualification)).toBeInTheDocument();
    }
    for (const work of member.selectedWork) {
      expect(within(section).getByText(work.title)).toBeInTheDocument();
    }
  }
});

test('the team page explains what is delegated and what is not', () => {
  render(<TeamPage />);

  expect(screen.getByText(/The procedure is not delegated to anybody\./)).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /book a consultation/i })[0]).toHaveAttribute('href', '/book');
});

test('the team page publishes both consultants as Physician structured data', () => {
  const { container } = render(<TeamPage />);
  const script = container.querySelector('script[type="application/ld+json"]');
  const data = JSON.parse(script!.innerHTML);

  const names = data.employee.map((e: { name: string }) => e.name);
  expect(names).toContain('Professor Dhiraj Gupta');
  for (const member of teamMembers) {
    expect(names).toContain(member.name);
  }
  expect(data.employee.every((e: { '@type': string }) => e['@type'] === 'Physician')).toBe(true);
});

test('the team page has no axe violations', async () => {
  const { container } = render(<TeamPage />);
  expect(await axe(container)).toHaveNoViolations();
});
