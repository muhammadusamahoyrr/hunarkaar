import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import Homepage from '@/components/Homepage';

export const revalidate = 10; // Revalidate dynamic contents on interval

export default async function Page() {
  await connectToDatabase();
  let products = await Product.find({}).sort({ createdAt: -1 }).lean();

  // Trigger self-seeding if empty
  if (products.length === 0) {
    const { GET } = await import('@/app/api/products/route');
    const res = await GET();
    const data = await res.json();
    products = data.products || [];
  }

  // Serialize Mongoose docs for client props injection
  const serializedProducts = products.map((product: any) => ({
    id: product._id ? product._id.toString() : product.id,
    name: product.name,
    category: product.category,
    usdPrice: product.usdPrice,
    pkrPrice: product.pkrPrice,
    img: product.img,
    description: product.description,
    artisan: product.artisan,
  }));

  return <Homepage initialProducts={serializedProducts} />;
}
