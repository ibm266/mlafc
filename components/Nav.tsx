'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/Logo';

const LINKS = [
  { href: '/conditions', label: 'Conditions' },
  { href: '/evidence', label: 'The Evidence' },
  { href: '/journey', label: 'The Journey' },
  { href: '/testimonials', label: 'Voices' },
] as const;

function isActive(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(active: boolean) {
  return active
    ? 'interactive border-b-2 border-brass pb-0.5 text-[15px] font-semibold text-ink'
    : 'interactive text-[15px] font-medium text-ink-soft hover:text-ink';
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const menu = mobileMenuRef.current;
    const getFocusable = () =>
      Array.from(
        menu?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    requestAnimationFrame(() => getFocusable()[0]?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (!menu?.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const headerSurface = open
    ? 'border-line bg-paper shadow-[0_2px_16px_var(--color-line)]'
    : scrolled
      ? 'border-line bg-paper/95 shadow-[0_2px_16px_var(--color-line)]'
      : 'border-transparent bg-paper/95';
  const headerPadding = scrolled || open ? 'py-2' : 'py-4';

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur transition-all duration-300 md:bg-paper/95 ${headerSurface} ${headerPadding}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="Mumbai London AF Clinic home" onClick={() => setOpen(false)}>
          <Logo variant="mark" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass(isActive(link.href, pathname))}>
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="interactive rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-paper hover:bg-night"
          >
            Book a consultation
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/book"
            className="interactive inline-flex min-h-11 items-center rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-night"
          >
            Book a consultation
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((current) => !current)}
            className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 text-ink"
          >
            <span aria-hidden className={`h-0.5 w-6 bg-current transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span aria-hidden className={`h-0.5 w-6 bg-current ${open ? 'opacity-0' : ''}`} />
            <span aria-hidden className={`h-0.5 w-6 bg-current transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-menu"
          ref={mobileMenuRef}
          aria-label="Mobile"
          className="border-t border-line bg-paper px-5 py-6 md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`interactive block py-1 font-serif text-2xl leading-snug sm:text-3xl ${
                    isActive(link.href, pathname) ? 'text-brass-deep' : 'text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className={`interactive block py-1 font-serif text-2xl leading-snug sm:text-3xl ${
                  isActive('/book', pathname) ? 'text-brass-deep' : 'text-ink'
                }`}
              >
                Book a consultation
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
