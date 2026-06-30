import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import CategoryPage from '@/components/CategoryPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Textiles — Ajrak, Ralli & Phulkari | Hunarkar',
  description:
    'Explore handwoven and block-printed Pakistani textiles: Ajrak, Ralli quilts, Phulkari embroidery, and more. Each piece certified authentic, made by master artisans in Sindh and Punjab.',
};

export const revalidate = 60;

export default async function TextilesPage() {
  await connectToDatabase();

  const TEXTILE_CATEGORIES = ['Ajrak', 'Ralli', 'Textiles', 'Phulkari', 'Shawl', 'Khes'];

  let textileProducts = await Product.find({
    category: { $in: TEXTILE_CATEGORIES },
  })
    .sort({ createdAt: -1 })
    .lean();

  /* Fall back to all products if the DB has no textile entries yet */
  if (textileProducts.length === 0) {
    textileProducts = await Product.find({}).sort({ createdAt: -1 }).lean();
  }

  /* Cross-sell: products NOT in the textile category */
  let crossSellProducts = await Product.find({
    category: { $nin: TEXTILE_CATEGORIES },
  })
    .limit(4)
    .lean();

  /* Serialize Mongoose docs */
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

  return (
    <CategoryPage
      products={textileProducts.map(serialize)}
      crossSellProducts={crossSellProducts.map(serialize)}
    />
  );
}
