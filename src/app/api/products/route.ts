import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';

const defaultProducts = [
  {
    name: 'Chiniot Walnut Keepsake Chest',
    category: 'Woodcarving',
    usdPrice: 52,
    pkrPrice: 14500,
    img: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop',
    description: 'An intricately detailed box handcarved from a single piece of premium wild walnut wood in Chiniot. Standard brass structural pivots and velvet interior lining.',
    artisan: 'Master Carver Khurshid Alam, Chiniot Studio'
  },
  {
    name: 'Multan Cobalt Floral Urn',
    category: 'Blue Pottery',
    usdPrice: 79,
    pkrPrice: 22000,
    img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop',
    description: 'Traditional terracotta clay urn decorated by hand-painting underglaze cobalt floral motifs. Subjected to double furnace high temperature firing.',
    artisan: 'Ustad Shamil Raza, Multani Blue Art'
  },
  {
    name: 'Indigo Block-Printed Silk Shawl',
    category: 'Ajrak',
    usdPrice: 30,
    pkrPrice: 8500,
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
    description: 'Authentic 14-stage block printed shawl using native organic vegetable inks, pomegranate peels, and pure indigo dyes on premium silk thread base.',
    artisan: 'Mai Bakhtawar, Bhit Shah Handloom'
  },
  {
    name: 'Royal Zardozi Leather Khussa',
    category: 'Khussa',
    usdPrice: 35,
    pkrPrice: 9800,
    img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop',
    description: 'Premium buffalo hide leather shoe tailored with gold-coated metallic zardozi threads. Traditional padding inside for maximum comfort structure.',
    artisan: 'Mohammad Din, Rawalpindi Saddar Bazaar'
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    
    let products = await Product.find({}).sort({ createdAt: -1 });
    
    // Auto-seed if database is empty
    if (products.length === 0) {
      await Product.insertMany(defaultProducts);
      products = await Product.find({}).sort({ createdAt: -1 });
    }
    
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
