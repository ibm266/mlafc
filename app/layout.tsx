import type { Metadata } from 'next';
import { Newsreader, Archivo } from 'next/font/google';
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
      <body>{children}</body>
    </html>
  );
}
