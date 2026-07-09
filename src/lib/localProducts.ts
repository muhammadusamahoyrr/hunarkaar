/* ============================================================
   LOCAL PRODUCTS — public-folder furniture with multi-angle
   galleries. Shared by ShopPage (listing) and the PDP route.
   ============================================================ */
import type { ProductItem } from './siteData';

export interface LocalProduct extends ProductItem {
  gallery: string[];   // all angle images (first === img)
  dimensions: string;  // W × D × H
}

export const LOCAL_PRODUCTS: LocalProduct[] = [
  {
    id: 'lp-a', name: 'Woven Leather Bench', category: 'Bench', usdPrice: 189, pkrPrice: 52920,
    img: '/Woven Leather Bench/a1.png',
    gallery: ['/Woven Leather Bench/a1.png', '/Woven Leather Bench/a2.png', '/Woven Leather Bench/a3.png'],
    dimensions: '120 × 40 × 45 cm',
    description: 'Hand-woven natural leather strips over a solid teak frame. Each piece is unique.',
    artisan: 'Ustad Noor Ahmad, Lahore',
  },
  {
    id: 'lp-b', name: 'Chiniot Walnut Wood Bench', category: 'Bench', usdPrice: 245, pkrPrice: 68600,
    img: '/woodbench/b1.png',
    gallery: ['/woodbench/b1.png', '/woodbench/b2.png', '/woodbench/b3.png'],
    dimensions: '130 × 42 × 46 cm',
    description: 'Hand-carved walnut bench from the master woodcarvers of Chiniot.',
    artisan: 'Khurshid Alam, Chiniot Studio',
  },
  {
    id: 'lp-c', name: 'Foldable Cotton Kilim Bench', category: 'Bench', usdPrice: 129, pkrPrice: 36120,
    img: '/Foldable Cotton Kilim Bench/c1.png',
    gallery: ['/Foldable Cotton Kilim Bench/c1.png', '/Foldable Cotton Kilim Bench/c2.png', '/Foldable Cotton Kilim Bench/c3.png'],
    dimensions: '110 × 38 × 44 cm',
    description: 'Foldable bench upholstered in hand-woven kilim cotton from Sindh.',
    artisan: 'Mai Fatima, Bhit Shah',
  },
  {
    id: 'lp-d', name: 'Palm Leaf Bench', category: 'Bench', usdPrice: 98, pkrPrice: 27440,
    img: '/Palm Leaf Bench/d1.png',
    gallery: ['/Palm Leaf Bench/d1.png', '/Palm Leaf Bench/d2.png', '/Palm Leaf Bench/d3.png'],
    dimensions: '105 × 36 × 43 cm',
    description: 'Woven palm leaf bench, sustainably crafted by Balochi artisans.',
    artisan: 'Haji Sardar, Quetta Collective',
  },
  {
    id: 'lp-e', name: 'Real Walnut Wood Bench', category: 'Bench', usdPrice: 310, pkrPrice: 86800,
    img: '/Real Walnut Wood Bench/e1.png',
    gallery: ['/Real Walnut Wood Bench/e1.png', '/Real Walnut Wood Bench/e2.png', '/Real Walnut Wood Bench/e3.png'],
    dimensions: '140 × 44 × 47 cm',
    description: 'Solid walnut bench with hand-chiselled joinery. No metal fasteners.',
    artisan: 'Master Iqbal, Rawalpindi Workshop',
  },
  {
    id: 'lp-f', name: 'Handwoven Palm Leaf Bench', category: 'Bench', usdPrice: 115, pkrPrice: 32200,
    img: '/handwoven Palm Leaf Bench/f1.png',
    gallery: ['/handwoven Palm Leaf Bench/f1.png', '/handwoven Palm Leaf Bench/f2.png', '/handwoven Palm Leaf Bench/f3.png', '/handwoven Palm Leaf Bench/f4.png'],
    dimensions: '112 × 37 × 44 cm',
    description: 'Tightly woven palm leaf over a bamboo frame. Lightweight and durable.',
    artisan: 'Gohar Bibi, Sindh Craft Council',
  },
  {
    id: 'lp-g', name: 'Chaise Lounge', category: 'Lounge', usdPrice: 420, pkrPrice: 117600,
    img: '/chaise lounge/g1.png',
    gallery: ['/chaise lounge/g1.png', '/chaise lounge/g2.png', '/chaise lounge/g3.png'],
    dimensions: '160 × 65 × 80 cm',
    description: 'Relaxed chaise lounge in hand-dyed cotton canvas on solid mango wood frame.',
    artisan: 'Aziz Furniture House, Lahore',
  },
  {
    id: 'lp-h', name: 'Natural Leather Bench', category: 'Bench', usdPrice: 220, pkrPrice: 61600,
    img: '/Natural Leather Bench/h1.png',
    gallery: ['/Natural Leather Bench/h1.png', '/Natural Leather Bench/h2.png', '/Natural Leather Bench/h3.png', '/Natural Leather Bench/h4.png'],
    dimensions: '125 × 41 × 45 cm',
    description: 'Full-grain buffalo leather bench hand-stitched by master leather craftsmen.',
    artisan: 'Ghulam Nabi, Karachi Saddar',
  },
  {
    id: 'lp-i', name: 'Kilim Rug Bench', category: 'Bench', usdPrice: 165, pkrPrice: 46200,
    img: '/Kilim Rug Bench/i1.png',
    gallery: ['/Kilim Rug Bench/i1.png', '/Kilim Rug Bench/i2.png', '/Kilim Rug Bench/i3.png'],
    dimensions: '118 × 40 × 45 cm',
    description: 'Vintage kilim fabric over a solid oak base. Each fabric is sourced from antique looms.',
    artisan: 'Amina Textiles, Multan',
  },
  {
    id: 'lp-j', name: 'Jute Kilim Bench', category: 'Bench', usdPrice: 109, pkrPrice: 30520,
    img: '/Jute Kilim Bench/j1.png',
    gallery: ['/Jute Kilim Bench/j1.png', '/Jute Kilim Bench/j2.png', '/Jute Kilim Bench/j3.png', '/Jute Kilim Bench/j4.png'],
    dimensions: '115 × 39 × 44 cm',
    description: 'Eco-friendly jute kilim over reclaimed wood. Earthy tones, artisan finish.',
    artisan: 'Sajida Looms, Hyderabad',
  },
  {
    id: 'lp-k', name: 'Solid Teak Wood Stool', category: 'Stool', usdPrice: 88, pkrPrice: 24640,
    img: '/Solid Teak Wood Stool/k1.png',
    gallery: ['/Solid Teak Wood Stool/k1.png', '/Solid Teak Wood Stool/k2.png', '/Solid Teak Wood Stool/k3.png', '/Solid Teak Wood Stool/k4.png'],
    dimensions: '40 × 40 × 45 cm',
    description: 'Single-piece solid teak stool with hand-turned legs. Oil-finished for longevity.',
    artisan: 'Tariq Woodworks, Gujranwala',
  },
  {
    id: 'lp-t', name: 'Brown Truffle Woven Bench', category: 'Bench', usdPrice: 175, pkrPrice: 49000,
    img: '/Brown Truffle Woven Bench/t1.png',
    gallery: ['/Brown Truffle Woven Bench/t1.png', '/Brown Truffle Woven Bench/t2.png', '/Brown Truffle Woven Bench/t3.png'],
    dimensions: '122 × 40 × 45 cm',
    description: 'Rich truffle-toned woven leather bench with mahogany base.',
    artisan: 'Ustad Bashir, Sialkot Leather Guild',
  },
  {
    id: 'lp-l', name: 'Handmade Kilim Bench', category: 'Bench', usdPrice: 148, pkrPrice: 41440,
    img: '/handmade  Kilim Bench/l1.png',
    gallery: ['/handmade  Kilim Bench/l1.png', '/handmade  Kilim Bench/l2.png', '/handmade  Kilim Bench/l3.png', '/handmade  Kilim Bench/l4.png'],
    dimensions: '120 × 40 × 45 cm',
    description: 'Vibrant kilim patchwork on solid walnut. Each bench is a unique composition.',
    artisan: 'Zubeda Craft House, Lahore',
  },
  {
    id: 'lp-u', name: 'Rattan Bench', category: 'Bench', usdPrice: 135, pkrPrice: 37800,
    img: '/Rattan Bench/u1.png',
    gallery: ['/Rattan Bench/u1.png', '/Rattan Bench/u2.png', '/Rattan Bench/u3.png', '/Rattan Bench/u4.png'],
    dimensions: '116 × 38 × 44 cm',
    description: 'Hand-woven rattan over a black-lacquered steel frame. Indoor & veranda ready.',
    artisan: 'Mukhtar Rattan Arts, Peshawar',
  },
  {
    id: 'lp-v', name: 'Upholstered Wooden Slipper Chair', category: 'Chair', usdPrice: 295, pkrPrice: 82600,
    img: '/Upholstered Wooden Slipper Chair/v1.png',
    gallery: ['/Upholstered Wooden Slipper Chair/v1.png', '/Upholstered Wooden Slipper Chair/v2.png', '/Upholstered Wooden Slipper Chair/v3.png', '/Upholstered Wooden Slipper Chair/v4.png'],
    dimensions: '60 × 70 × 85 cm',
    description: 'Low-profile slipper chair with hand-carved walnut legs and block-print upholstery.',
    artisan: 'Fazal Ahmad, Chiniot Master Guild',
  },
  {
    id: 'lp-vc', name: 'Handmade Canella Chair', category: 'Chair', usdPrice: 265, pkrPrice: 74200,
    img: '/handmade Canella/v.png',
    gallery: ['/handmade Canella/v.png', '/handmade Canella/v2.png', '/handmade Canella/v3.png', '/handmade Canella/v4.png'],
    dimensions: '58 × 62 × 82 cm',
    description: 'Sculptural canella cane chair woven in a traditional spiral pattern.',
    artisan: 'Rasheed Furniture Co., Rawalpindi',
  },
];

export function getLocalProductById(id: string): LocalProduct | undefined {
  return LOCAL_PRODUCTS.find(p => p.id === id);
}

/** Related products by shared category (excluding the current one). */
export function getRelatedLocalProducts(id: string, limit = 4): LocalProduct[] {
  const current = getLocalProductById(id);
  const pool = LOCAL_PRODUCTS.filter(p => p.id !== id);
  const sameCat = current ? pool.filter(p => p.category === current.category) : [];
  const rest = pool.filter(p => !sameCat.includes(p));
  return [...sameCat, ...rest].slice(0, limit);
}
