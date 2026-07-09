import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import ProductDetail from '@/components/ProductDetail';
import {
  getLocalProductById, getRelatedLocalProducts, LOCAL_PRODUCTS,
  type LocalProduct,
} from '@/lib/localProducts';
import type { ProductItem } from '@/lib/siteData';
import { notFound } from 'next/navigation';

export const revalidate = 10;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let product: LocalProduct | null = getLocalProductById(id) ?? null;

  // Fall back to a DB product (single image → single-image gallery)
  if (!product) {
    try {
      await connectToDatabase();
      const doc: any = await Product.findById(id).lean();
      if (doc) {
        product = {
          id: doc._id.toString(), name: doc.name, category: doc.category,
          usdPrice: doc.usdPrice, pkrPrice: doc.pkrPrice, img: doc.img,
          description: doc.description, artisan: doc.artisan,
          gallery: [doc.img], dimensions: 'Handcrafted — dimensions vary',
        };
      }
    } catch {
      /* invalid id / db offline → notFound below */
    }
  }

  if (!product) notFound();

  const related: ProductItem[] = getRelatedLocalProducts(product.id, 4).map(p => ({
    id: p.id, name: p.name, category: p.category,
    usdPrice: p.usdPrice, pkrPrice: p.pkrPrice, img: p.img,
    description: p.description, artisan: p.artisan,
  }));

  return <ProductDetail product={product} related={related} />;
}

export function generateStaticParams() {
  return LOCAL_PRODUCTS.map(p => ({ id: p.id }));
}
