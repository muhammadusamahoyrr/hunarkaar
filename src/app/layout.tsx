import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/Toast';

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
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        {/* Mounted once at the root: Homepage, SiteShell and CategoryPage all
            raise toasts, and each needs the same viewport rather than three
            competing stacks. ToastProvider is a client component; a server
            layout may render it. */}
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
