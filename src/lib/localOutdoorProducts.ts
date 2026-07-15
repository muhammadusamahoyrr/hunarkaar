import type { LocalProduct } from './localProducts';

export interface OutdoorProduct extends LocalProduct {
  weatherTag: string;
}

const U = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=80`;

export const LOCAL_OUTDOOR_PRODUCTS: OutdoorProduct[] = [

  // Category 1: Jhoola & Swing Chairs
  {
    id: 'lp-out-1',
    name: 'Classic Sheesham Jhoola',
    category: 'Swing',
    usdPrice: 680,
    pkrPrice: 190400,
    img: U('photo-1595515106969-1ce29566ff1c', 800),
    gallery: [U('photo-1595515106969-1ce29566ff1c', 800), U('photo-1567223239-6644f5011f0a', 800)],
    dimensions: '160 x 60 x 180 cm',
    description: 'Solid sheesham wood jhoola with hand-knotted cotton rope seat and decorative turned balusters. Folds flat for seasonal storage.',
    artisan: 'Ustad Hamid & Sons, Lahore',
    weatherTag: 'Sheesham - Oiled Finish',
  },
  {
    id: 'lp-out-2',
    name: 'Rattan Egg Swing Chair',
    category: 'Swing',
    usdPrice: 420,
    pkrPrice: 117600,
    img: U('photo-1548811225-b44c6691c953', 800),
    gallery: [U('photo-1548811225-b44c6691c953', 800)],
    dimensions: 'O 110 x 130 cm (with cushion)',
    description: 'Hand-woven polymer rattan egg chair suspended from a powder-coated steel ceiling mount. Includes weatherproof seat cushion.',
    artisan: 'Mukhtar Rattan Arts, Peshawar',
    weatherTag: 'Rattan - UV-Treated',
  },
  {
    id: 'lp-out-3',
    name: 'Carved Mango Wood Jhula',
    category: 'Swing',
    usdPrice: 540,
    pkrPrice: 151200,
    img: U('photo-1567223239-6644f5011f0a', 800),
    gallery: [U('photo-1567223239-6644f5011f0a', 800)],
    dimensions: '150 x 55 x 170 cm',
    description: 'Ornately carved mango wood jhula with hand-painted floral motifs and heavy-duty chain fixtures. Traditional Mughal courtyard aesthetic.',
    artisan: 'Bashir Woodcarvers, Chiniot',
    weatherTag: 'Mango Wood - Weather-Sealed',
  },

  // Category 2: Garden Sofas
  {
    id: 'lp-out-4',
    name: 'Wicker Garden Sofa Set',
    category: 'Garden Sofa',
    usdPrice: 1200,
    pkrPrice: 336000,
    img: U('photo-qMfjjGHEtSs', 800),
    gallery: [U('photo-qMfjjGHEtSs', 800)],
    dimensions: '3-Seater: 190 x 75 x 80 cm',
    description: 'All-weather PE wicker sofa set with aluminium frame. Deep-fill quick-dry cushions in natural linen. Includes 2 armchairs and coffee table.',
    artisan: 'Tariq Woodworks, Gujranwala',
    weatherTag: 'PE Wicker - All-Season',
  },
  {
    id: 'lp-out-5',
    name: 'Teak L-Shape Garden Sectional',
    category: 'Garden Sofa',
    usdPrice: 1850,
    pkrPrice: 518000,
    img: U('photo-OtBwtMTTxWQ', 800),
    gallery: [U('photo-OtBwtMTTxWQ', 800)],
    dimensions: '280 x 200 x 75 cm (L-Shape)',
    description: 'Grade-A teak sectional sofa with removable Sunbrella fabric cushions. Modular pieces reconfigure into different arrangements.',
    artisan: 'Khurshid Alam, Chiniot Studio',
    weatherTag: 'Teak - Marine-Grade',
  },

  // Category 3: Outdoor Dining Sets
  {
    id: 'lp-out-6',
    name: 'Sheesham Courtyard Dining Table',
    category: 'Dining Table',
    usdPrice: 890,
    pkrPrice: 249200,
    img: U('photo-1577140917170-285929fb55b7', 800),
    gallery: [U('photo-1577140917170-285929fb55b7', 800)],
    dimensions: '180 x 90 x 75 cm',
    description: 'Solid seasoned sheesham with natural marine oils and marine-grade hardware. Seats 6 comfortably on a veranda.',
    artisan: 'Ustad Hamid & Sons, Lahore',
    weatherTag: 'Hardwood - Water-Resistant',
  },
  {
    id: 'lp-out-7',
    name: 'Hand-Woven Rope Dining Chair',
    category: 'Dining Chair',
    usdPrice: 185,
    pkrPrice: 51800,
    img: U('photo-1592078615290-033ee584e267', 800),
    gallery: [U('photo-1592078615290-033ee584e267', 800)],
    dimensions: '56 x 60 x 85 cm',
    description: 'High-tensile outdoor rope hand-stretched across a rust-proof aluminum frame. Stackable and UV stabilised.',
    artisan: 'Sajida Looms, Hyderabad',
    weatherTag: 'Rope - Mold-Resistant',
  },
  {
    id: 'lp-out-8',
    name: 'Stone-Top Bistro Table',
    category: 'Dining Table',
    usdPrice: 460,
    pkrPrice: 128800,
    img: U('photo-1533759413974-9e15f3b745ac', 800),
    gallery: [U('photo-1533759413974-9e15f3b745ac', 800)],
    dimensions: 'O 80 x 72 cm',
    description: 'Marble composite stone top on a cast-iron pedestal base. Perfect for balconies and compact terraces. Frost and heat resistant.',
    artisan: 'Gohar Bibi, Sindh Craft Council',
    weatherTag: 'Stone - Frost-Resistant',
  },

  // Category 4: Planters & Clay Pots
  {
    id: 'lp-out-9',
    name: 'Multan Blue Glazed Planter',
    category: 'Planters',
    usdPrice: 120,
    pkrPrice: 33600,
    img: U('photo-1485955900006-10f4d324d411', 800),
    gallery: [U('photo-1485955900006-10f4d324d411', 800)],
    dimensions: 'O 45 x 55 cm',
    description: 'Hand-thrown frost-resistant clay pot painted with traditional cobalt blue Multani slips. Pre-drilled drainage holes.',
    artisan: 'Ustad Shamil Raza, Multani Blue Art',
    weatherTag: 'Clay - Frost-Proof',
  },
  {
    id: 'lp-out-10',
    name: 'Terracotta Courtyard Jar Set',
    category: 'Planters',
    usdPrice: 190,
    pkrPrice: 53200,
    img: U('photo-1416879595882-3373a0480b5b', 800),
    gallery: [U('photo-1416879595882-3373a0480b5b', 800)],
    dimensions: 'Set of 3: H 80/60/40 cm',
    description: 'Three graduated hand-rolled terracotta jars with natural earth-toned slip glazes. Sealed inside with food-safe waterproofing.',
    artisan: 'Rehmat Pottery, Hala, Sindh',
    weatherTag: 'Terracotta - Sealed',
  },

  // Category 5: Courtyard Fountains
  {
    id: 'lp-out-11',
    name: 'Hand-Beaten Copper Fountain',
    category: 'Fountain',
    usdPrice: 1100,
    pkrPrice: 308000,
    img: U('photo-1507473885765-e6ed057f782c', 800),
    gallery: [U('photo-1507473885765-e6ed057f782c', 800)],
    dimensions: 'O 70 x 95 cm',
    description: 'Three-tier hand-beaten copper fountain with submersible pump and adjustable flow rate. Develops a gorgeous verdigris patina over time.',
    artisan: 'Thathera Collective, Lahore Walled City',
    weatherTag: 'Copper - Rust-Resistant',
  },
  {
    id: 'lp-out-12',
    name: 'Blue Pottery Bowl Fountain',
    category: 'Fountain',
    usdPrice: 640,
    pkrPrice: 179200,
    img: U('photo-1543258103-a62bdc069871', 800),
    gallery: [U('photo-1543258103-a62bdc069871', 800)],
    dimensions: 'O 90 x 55 cm',
    description: 'Oversized Multani blue glazed ceramic bowl fountain with concealed recirculating pump and stone cobble base.',
    artisan: 'Ustad Shamil Raza, Multani Blue Art',
    weatherTag: 'Ceramic - Weatherproof',
  },
];

export interface BundleSet {
  id: string;
  name: string;
  description: string;
  products: OutdoorProduct[];
  bundlePriceUsd: number;
  bundlePricePkr: number;
}

export const OUTDOOR_BUNDLES: BundleSet[] = [
  {
    id: 'bundle-dining',
    name: 'The Veranda Dining Set',
    description: 'Complete courtyard dining - the Sheesham table paired with Rope Dining Chairs for a cohesive artisan-crafted outdoor experience.',
    products: [
      LOCAL_OUTDOOR_PRODUCTS[5],
      LOCAL_OUTDOOR_PRODUCTS[6],
      { ...LOCAL_OUTDOOR_PRODUCTS[6], id: 'lp-out-7-b' },
    ],
    bundlePriceUsd: 1180,
    bundlePricePkr: 330400,
  },
  {
    id: 'bundle-jhoola',
    name: 'The Courtyard Swing Bundle',
    description: 'Recreate a classic Pakistani courtyard - the carved sheesham jhoola paired with a Multan glazed planter and terracotta jar set.',
    products: [
      LOCAL_OUTDOOR_PRODUCTS[0],
      LOCAL_OUTDOOR_PRODUCTS[8],
      LOCAL_OUTDOOR_PRODUCTS[9],
    ],
    bundlePriceUsd: 940,
    bundlePricePkr: 263200,
  },
];
