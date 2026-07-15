import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/Toast';
import { CartProvider } from '@/lib/CartContext';

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
        {/* Both mounted once at the root, for the same reason: Homepage,
            ShopPage and SiteShell each used to hold private copies of this
            state, so a navigation reset it. The cart in particular emptied
            itself on every route change. Client components; a server layout
            may render them. */}
        <CartProvider>
          <ToastProvider>{children}</ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
