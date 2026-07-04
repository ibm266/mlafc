import type { Metadata } from 'next';
import { Newsreader, Archivo } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';
import { WhatsAppFab } from '@/components/WhatsAppFab';
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
  title: 'Mumbai London AF Clinic',
  description:
    'Specialist atrial fibrillation care in Mumbai from Professor Dhiraj Gupta, consultant cardiologist and electrophysiologist at Liverpool Heart and Chest Hospital.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${archivo.variable}`}>
      <body>
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
