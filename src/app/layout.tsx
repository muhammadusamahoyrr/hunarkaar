import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost, Playfair_Display } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hunarkar | Where Craft Becomes Heritage | Master Artisan Crafts from Rawalpindi',
  description: 'Experience premium Pakistani artisan crafts from Rawalpindi. Buy exquisite blue pottery, Ajrak, woodcarving, Ralli quilts, brassware, and Khussa handmade by local master artisans.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
