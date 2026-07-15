import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { LOCAL_PRODUCTS, LIGHTING_PRODUCTS } from '@/lib/localProducts';
import {
  ARTISANS, getArtisanBySlug, getCraft, productsByArtisan,
} from '@/lib/artisans';
import type { ProductItem } from '@/lib/siteData';
import ArtisanPage from '@/components/ArtisanPage';

export const revalidate = 60;

export function generateStaticParams() {
  return ARTISANS.map(a => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const artisan = getArtisanBySlug(slug);
  if (!artisan) return { title: 'Artisan not found | Hunarkar' };

  const craft = getCraft(artisan);
  return {
    title: `${artisan.name} — ${craft.discipline}, ${artisan.city} | Hunarkar`,
    description:
      `${artisan.name} of ${artisan.studio} has worked in ${craft.label.toLowerCase()} ` +
      `since ${artisan.since}. See how a piece is made, and the work itself.`,
  };
}

/** Local products carry multi-angle galleries; DB products carry one image. */
function localAsProductItem(p: (typeof LOCAL_PRODUCTS)[number]): ProductItem {
  return {
    id: p.id, name: p.name, category: p.category,
    usdPrice: p.usdPrice, pkrPrice: p.pkrPrice, img: p.img,
    description: p.description, artisan: p.artisan,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artisan = getArtisanBySlug(slug);
  if (!artisan) notFound();

  const craft = getCraft(artisan);

  /* Pool both sources. An artisan can have work in either — Khurshid Alam has
     benches in localProducts and a keepsake chest in the DB. */
  let dbProducts: ProductItem[] = [];
  try {
    await connectToDatabase();
    const docs = await Product.find({}).lean();
    dbProducts = docs.map(d => ({
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
    /* DB offline — the local catalogue alone still renders a full page */
  }

  const codeProducts = [...LOCAL_PRODUCTS, ...LIGHTING_PRODUCTS];
  const pool: ProductItem[] = [...codeProducts.map(localAsProductItem), ...dbProducts];
  const works = productsByArtisan(artisan, pool);

  /* The Hand: close-ups taken from this artisan's own galleries rather than
     bought-in texture.

     The whole gallery is used, including the frame that also heads the card in
     The Work. Dropping it looked tidier but starved the band: most artisans
     have exactly one local product with a three-image gallery, so skipping the
     first left two images and the band fell below its own minimum and vanished
     on nearly every page. The band crops hard to a 400px-tall cell, so a
     repeated frame reads as a detail, not a duplicate.

     Under three images it reads as an accident rather than a decision, so it
     is dropped — which is the case for the DB-only artisans, who have a single
     image to their name. */
  const macros = [
    ...new Set(
      productsByArtisan(artisan, codeProducts).flatMap(p => p.gallery),
    ),
  ].slice(0, 6);

  return (
    <ArtisanPage
      artisan={artisan}
      craft={craft}
      works={works}
      macros={macros.length >= 3 ? macros : []}
    />
  );
}
