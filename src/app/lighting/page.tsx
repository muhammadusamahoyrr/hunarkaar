import type { Metadata } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { LIGHTING_PRODUCTS } from '@/lib/localProducts';
import type { ProductItem } from '@/lib/siteData';
import LightingPage from '@/components/LightingPage';

export const metadata: Metadata = {
  title: 'Lighting — Hand-Beaten Brass, Pierced Lanterns & Naqashi Lamps | Hunarkar',
  description:
    'Hand-forged Pakistani lighting: pierced brass lanterns from Rawalpindi, naqashi camel-skin lamps from Multan, and hand-raised pendants. Ambient, task and accent light, made by named artisans.',
};

export const revalidate = 60;

export default async function Page() {
  /* The catalogue's lighting lives in code (LIGHTING_PRODUCTS); the DB
     contributes anything lit — matched by name, since its lighting sits
     under the broader "Brasswork" category. The brass drum table shares
     that category and is deliberately NOT lighting, hence no category
     match on "Brasswork". */
  let dbLighting: ProductItem[] = [];
  try {
    await connectToDatabase();
    const docs = await Product.find({
      $or: [
        { category: 'Lighting' },
        { name: { $regex: 'lantern|lamp|light|chandelier|diya', $options: 'i' } },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();
    dbLighting = docs.map(d => ({
      id: String(d._id),
      name: d.name,
      category: d.category,
      usdPrice: d.usdPrice,
      pkrPrice: d.pkrPrice,
      img: d.img,
      description: d.description,
      artisan: d.artisan,
    }));
  } catch {
    /* DB offline — the code-defined collection still renders a full page */
  }

  const products: ProductItem[] = [
    ...LIGHTING_PRODUCTS.map(p => ({
      id: p.id, name: p.name, category: p.category,
      usdPrice: p.usdPrice, pkrPrice: p.pkrPrice, img: p.img,
      description: p.description, artisan: p.artisan,
    })),
    ...dbLighting,
  ];

  return <LightingPage products={products} />;
}
