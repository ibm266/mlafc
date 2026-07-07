import type { Metadata } from 'next';
import { Newsreader, Archivo } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Nav } from '@/components/Nav';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { site } from '@/data/site';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500'],
  variable: '--font-newsreader',
});

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-archivo',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Mumbai London AF Clinic', template: '%s' },
  description:
    'Specialist atrial fibrillation care in Mumbai from Professor Dhiraj Gupta, consultant cardiologist and electrophysiologist at Liverpool Heart and Chest Hospital.',
  openGraph: {
    siteName: 'Mumbai London AF Clinic',
    type: 'website',
    locale: 'en_GB',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${archivo.variable}`}>
      <body>
        <JsonLd />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Nav />
        {children}
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
