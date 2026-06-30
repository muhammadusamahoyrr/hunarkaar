import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import ShopPage from '@/components/ShopPage';

export const revalidate = 10;

export default async function AllLivingRoomPage() {
  await connectToDatabase();
  let products = await Product.find({}).sort({ createdAt: -1 }).lean();

  if (products.length === 0) {
    const { GET } = await import('@/app/api/products/route');
    const res = await GET();
    const data = await res.json();
    products = data.products || [];
  }

  const serialized = products.map((p: any) => ({
    id: p._id ? p._id.toString() : p.id,
    name: p.name,
    category: p.category,
    usdPrice: p.usdPrice,
    pkrPrice: p.pkrPrice,
    img: p.img,
    description: p.description,
    artisan: p.artisan,
  }));

  return <ShopPage initialProducts={serialized} />;
}
