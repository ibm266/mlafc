import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { site } from '@/data/site';

const pageLinks = [
  { href: '/evidence', label: 'The Evidence' },
  { href: '/journey', label: 'The Journey' },
  { href: '/locations', label: 'Where He Works' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/book', label: 'Book a consultation' },
] as const;

const patientLinks = [
  { href: '/journey', label: 'What to expect' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/book', label: 'Request an appointment' },
] as const;

function contactHref(kind: 'tel' | 'mailto', value: string) {
  return value.includes('[placeholder]') ? undefined : `${kind}:${value}`;
}

export function Footer() {
  return (
    <footer className="border-t border-line-dark bg-night text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo variant="dark" />
          <p className="mt-4 max-w-sm text-sm text-paper/80">{site.tagline}</p>
        </div>

        <nav aria-label="Footer pages">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brass">Pages</h2>
          <ul className="space-y-2 text-sm">
            {pageLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brass">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer patient information">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brass">Patients</h2>
          <ul className="space-y-2 text-sm">
            {patientLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brass">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brass">Contact</h2>
          <ul className="space-y-2 text-sm text-paper/85">
            <li>{site.address}</li>
            <li>
              {contactHref('tel', site.phone) ? (
                <a href={contactHref('tel', site.phone)} className="hover:text-brass">
                  {site.phone}
                </a>
              ) : (
                site.phone
              )}
            </li>
            <li>
              {contactHref('mailto', site.email) ? (
                <a href={contactHref('mailto', site.email)} className="hover:text-brass">
                  {site.email}
                </a>
              ) : (
                site.email
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="mx-auto max-w-6xl space-y-2 px-5 py-6 text-xs text-paper/70">
          <p>{site.gmcLine}</p>
          <p>{site.disclaimer}</p>
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
