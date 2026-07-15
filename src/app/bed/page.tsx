import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import BedCategoryPage from '@/components/BedCategoryPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beds & Bedroom Furniture | Hunarkar',
  description:
    'Discover handcrafted canopy, storage, and platform beds made by master artisans. Explore organic walnut wood, raw flax linen, and custom heritage commissions.',
};

export const revalidate = 60;

const CURATED_BEDS = [
  {
    id: 'lp-bed-1',
    name: 'Chiniot Walnut Canopy Bed',
    category: 'Canopy',
    usdPrice: 1250,
    pkrPrice: 350000,
    img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1000&q=80'
    ],
    description: 'Seasoned walnut canopy bed with structural brass joinery.',
    artisan: 'Master Carver Khurshid Alam, Chiniot Studio',
    dimensions: '200 × 220 × 210 cm',
  },
  {
    id: 'lp-bed-2',
    name: 'Sindhi Handwoven Patchwork Bed',
    category: 'Platform',
    usdPrice: 890,
    pkrPrice: 249200,
    img: 'https://images.unsplash.com/photo-1505693395321-883724634266?w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505693395321-883724634266?w=1000&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&q=80'
    ],
    description: 'Traditional platform bed featuring hand-chiselled local rosewood feet and a headboard panel upholstered in Sindhi ralli patchwork fabric.',
    artisan: 'Mai Fatima, Bhit Shah Collective',
    dimensions: '180 × 200 × 110 cm',
  },
  {
    id: 'lp-bed-3',
    name: 'Belgian Linen Storage Bed',
    category: 'Storage',
    usdPrice: 980,
    pkrPrice: 274400,
    img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&q=80',
      'https://images.unsplash.com/photo-1616594039401-447596a2d9ab?w=1000&q=80'
    ],
    description: 'Modern upholstered bed featuring dual pull-out storage drawers on brass rollers, upholstered in raw flax Belgian linen.',
    artisan: 'Aziz Furniture House, Lahore',
    dimensions: '180 × 200 × 120 cm',
  },
  {
    id: 'lp-bed-4',
    name: 'Multan Blue Pottery Headboard Bed',
    category: 'Platform',
    usdPrice: 1150,
    pkrPrice: 322000,
    img: 'https://images.unsplash.com/photo-1617331140180-e8262094733a?w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1617331140180-e8262094733a?w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1000&q=80'
    ],
    description: 'Exquisite platform bed displaying hand-glazed cobalt blue floral pottery tiles inlaid into the solid wild walnut headboard frame.',
    artisan: 'Ustad Noor Ahmad, Lahore',
    dimensions: '160 × 200 × 105 cm',
  },
  {
    id: 'lp-bed-5',
    name: 'Swati Hand-Carved Canopy Bed',
    category: 'Canopy',
    usdPrice: 1450,
    pkrPrice: 406000,
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1000&q=80'
    ],
    description: 'Majestic Swati style canopy bed detailed with historic floral carvings across the columns and top beams. Sourced from aged Swat valley cedars.',
    artisan: 'Swat Valley Woodcarvers Council',
    dimensions: '200 × 220 × 220 cm',
  },
  {
    id: 'lp-bed-6',
    name: 'Upholstered Raw Silk Storage Bed',
    category: 'Storage',
    usdPrice: 1320,
    pkrPrice: 369600,
    img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&q=80',
      'https://images.unsplash.com/photo-1616594039401-447596a2d9ab?w=1000&q=80'
    ],
    description: 'Low platform storage bed upholstered in hand-woven raw silk thread, complete with high-density underbed hydraulic lifting storage compartment.',
    artisan: 'Lahore Upholstery Masters',
    dimensions: '180 × 200 × 115 cm',
  },
];

export default async function BedPage() {
  await connectToDatabase();

  let dbBeds = await Product.find({
    category: { $in: ['Bed', 'Beds', 'Bedroom'] },
  })
    .sort({ createdAt: -1 })
    .lean();

  const serialize = (p: any) => ({
    id:          p._id ? p._id.toString() : p.id,
    name:        p.name,
    category:    p.category,
    usdPrice:    p.usdPrice,
    pkrPrice:    p.pkrPrice,
    img:         p.img,
    description: p.description,
    artisan:     p.artisan,
  });

  const bedsList = dbBeds.length > 0 ? dbBeds.map(serialize) : CURATED_BEDS;

  /* Cross-sell: products NOT in the bed categories */
  let crossSellProducts = await Product.find({
    category: { $nin: ['Bed', 'Beds', 'Bedroom'] },
  })
    .limit(4)
    .lean();

  return (
    <BedCategoryPage
      products={bedsList}
      crossSellProducts={crossSellProducts.map(serialize)}
    />
  );
}
