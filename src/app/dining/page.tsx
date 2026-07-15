import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import ShopPage from '@/components/ShopPage';
import { LOCAL_DINING_PRODUCTS } from '@/lib/localDiningProducts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dining Room — Handcrafted Dining Tables, Chairs & Ceramics | Hunarkar',
  description: 'Discover handcrafted Pakistani dining room furniture and table settings. Featuring solid sheesham wood tables, hand-turned chairs, hand-beaten brass cutlery, and authentic Multani blue pottery.',
};

export const revalidate = 10;

const DINING_SUBCATEGORIES = [
  { label: 'All Dining', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80', filter: null },
  { label: 'Dining Tables', img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=400&q=80', filter: 'Dining Table' },
  { label: 'Dining Chairs', img: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=80', filter: 'Dining Chair' },
  { label: 'Cabinets & Storage', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80', filter: 'Storage' },
  { label: 'Ceramics & Dinnerware', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80', filter: 'Dinnerware' },
  { label: 'Table Linens', img: 'https://images.unsplash.com/photo-1603006905393-270fb864b971?w=400&q=80', filter: 'Linen' },
  { label: 'Brass & Cutlery', img: 'https://images.unsplash.com/photo-1594911774802-8822a707cbb3?w=400&q=80', filter: 'Cutlery' },
];

const DINING_MATERIALS = [
  'Walnut Wood',
  'Teak',
  'Brass',
  'Ceramic',
  'Clay',
  'Linen',
  'Cotton',
  'Rattan',
  'Mahogany',
];

export default async function DiningPage() {
  await connectToDatabase();

  // Fetch products that are either classified in dining categories, or contain dining keywords in name/description
  let products = await Product.find({
    $or: [
      { category: { $in: ['Dining Table', 'Dining Chair', 'Dinnerware', 'Cutlery', 'Linen', 'Tableware', 'Ceramics', 'Blue Pottery', 'Brasswork'] } },
      { name: { $regex: /dining|table|chair|plate|bowl|urn|pottery|cutlery|ceramic/i } },
      { description: { $regex: /dining|table|chair|plate|bowl|urn|pottery|cutlery|ceramic/i } }
    ]
  }).sort({ createdAt: -1 }).lean();

  if (products.length === 0) {
    const { GET } = await import('@/app/api/products/route');
    const res = await GET();
    const data = await res.json();
    const allProducts = data.products || [];
    products = allProducts.filter((p: any) =>
      ['Dining Table', 'Dining Chair', 'Dinnerware', 'Cutlery', 'Linen', 'Tableware', 'Ceramics', 'Blue Pottery', 'Brasswork'].includes(p.category) ||
      /dining|table|chair|plate|bowl|urn|pottery|cutlery|ceramic/i.test(p.name) ||
      /dining|table|chair|plate|bowl|urn|pottery|cutlery|ceramic/i.test(p.description)
    );
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

  return (
    <ShopPage
      initialProducts={serialized}
      localProducts={LOCAL_DINING_PRODUCTS}
      categoryType="dining"
      title="All Dining Room"
      breadcrumbLabel="Dining"
      subcategories={DINING_SUBCATEGORIES}
      materials={DINING_MATERIALS}
    />
  );
}
