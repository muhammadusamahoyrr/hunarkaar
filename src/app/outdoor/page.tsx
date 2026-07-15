import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import OutdoorCategoryPage from '@/components/OutdoorCategoryPage';
import { LOCAL_OUTDOOR_PRODUCTS } from '@/lib/localOutdoorProducts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Outdoor & Patio Furniture Collections | Hunarkar',
  description:
    'Discover handcrafted outdoor lounge sets, daybeds, rope dining sets, terracotta planters, and copper fire pits. All-weather materials built for luxury veranda living.',
};

export const revalidate = 60;

export default async function OutdoorPage() {
  let dbProducts: any[] = [];
  
  try {
    await connectToDatabase();

    // Query DB for any outdoor-specific products
    dbProducts = await Product.find({
      $or: [
        { category: { $in: ['Outdoor', 'Patio', 'Lounge Sets', 'Daybeds', 'Shade', 'Planters', 'Fire & Warmth'] } },
        { name: { $regex: /outdoor|patio|lounger|daybed|umbrella|planter|fire pit/i } },
        { description: { $regex: /outdoor|patio|lounger|daybed|umbrella|planter|fire pit/i } }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();
  } catch (err) {
    console.error('Failed to query database for outdoor products, falling back:', err);
  }

  const serialize = (p: any) => ({
    id:          p._id ? p._id.toString() : p.id,
    name:        p.name,
    category:    p.category,
    usdPrice:    p.usdPrice,
    pkrPrice:    p.pkrPrice,
    img:         p.img,
    gallery:     p.gallery || [p.img],
    dimensions:  p.dimensions || 'Custom Dimensions',
    description: p.description,
    artisan:     p.artisan,
    weatherTag:  p.weatherTag || 'Teak · All-Weather',
  });

  const productsList = dbProducts.length > 0
    ? dbProducts.map(serialize)
    : LOCAL_OUTDOOR_PRODUCTS;

  return <OutdoorCategoryPage products={productsList as any} />;
}
