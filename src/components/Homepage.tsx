'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import ShopTheRoom from './ShopTheRoom';
import { useToast } from './Toast';
import { useCart } from '@/lib/CartContext';

/* ============================================================
   TYPE DEFINITIONS
   ============================================================ */
interface ProductItem {
  id: string;
  name: string;
  category: string;
  usdPrice: number;
  pkrPrice: number;
  img: string;
  description: string;
  artisan: string;
}

interface HomepageProps {
  initialProducts: ProductItem[];
}

/* ============================================================
   CRAFT CATEGORIES DATA
   ============================================================ */
const CATEGORIES = [
  {
    id: 'blue-pottery',
    name: 'Blue Pottery',
    tag: 'Handpainted Clay',
    img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/blue-pottery/900/700',
    cardClass: 'hg-card-1',
  },
  {
    id: 'ajrak',
    name: 'Ajrak',
    tag: 'Natural Indigo Block Print',
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/ajrak-print/600/500',
    cardClass: 'hg-card-2',
  },
  {
    id: 'ralli',
    name: 'Ralli Quilts',
    tag: 'Patchwork Applique',
    img: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/ralli-quilt/600/500',
    cardClass: 'hg-card-3',
  },
  {
    id: 'khussa',
    name: 'Khussa',
    tag: 'Embroidered Leather',
    img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/khussa-shoes/600/500',
    cardClass: 'hg-card-4',
  },
  {
    id: 'woodcarving',
    name: 'Woodcarving',
    tag: 'Chinioti Walnut Wood',
    img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/wood-carve/600/500',
    cardClass: 'hg-card-5',
  },
  {
    id: 'brass',
    name: 'Brasswork',
    tag: 'Hand-hammered Metalware',
    img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/brass-work/600/500',
    cardClass: 'hg-card-6',
  },
  {
    id: 'onyx',
    name: 'Onyx Crafts',
    tag: 'Hand-carved Stone',
    img: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=900&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/onyx-stone/900/500',
    cardClass: 'hg-card-7',
  },
];

const MEGA_PRODUCTS = [
  'Chairs and stools',
  'Sofas and poufs',
  'Tables and side tables',
  'Shelving and storage',
  'Outdoor furniture',
  'Lighting',
  'Rugs',
  'Tableware',
  'Throws and cushions',
  'Decor',
];

const MEGA_ARTISANS = [
  'Master Potters',
  'Textile Weavers',
  'Wood Carvers',
  'Brass Smiths',
  'Onyx Craftsmen',
  'Rug Makers',
];

const MEGA_SERVICES = [
  'Interior Consultation',
  'Gift Registry',
  'Trade Programme',
  'Worldwide Shipping',
  'Care & Restoration',
];

const MEGA_HERITAGE = [
  'Our Story',
  'Fair Trade & Ethics',
  'The Craft Process',
  'Heritage Journal',
  'Certificate of Authenticity',
  'Press & Media',
];

/* ============================================================
   SHOP BY CATEGORY — marquee items

   Twelve, not six: the strip scrolls continuously, and a loop over
   six circles just shows the same six again. Every Unsplash id below
   was fetched and eyeballed as a circle crop before being committed —
   several otherwise-fine photos had the subject off in a corner and
   read as an empty disc at 134px.
   ============================================================ */
const CATEGORY_CIRCLES = [
  { id: 'cat-sidetable', name: 'Side Table', img: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=300&auto=format&fit=crop' },
  { id: 'cat-chairs',    name: 'Chairs',     img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=300&auto=format&fit=crop' },
  { id: 'cat-beds',      name: 'Beds',       img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=300&auto=format&fit=crop' },
  { id: 'cat-lamp',      name: 'Lamp',       img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=300&auto=format&fit=crop' },
  { id: 'cat-sofa',      name: 'Sofa',       img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300&auto=format&fit=crop' },
  { id: 'cat-drawer',    name: 'Drawer',     img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=300&auto=format&fit=crop' },
  { id: 'cat-stools',    name: 'Stools',     img: 'https://images.unsplash.com/photo-1537468243621-d21861d29fe3?q=80&w=300&auto=format&fit=crop' },
  { id: 'cat-cabinets',  name: 'Cabinets',   img: 'https://images.unsplash.com/photo-1777027518757-a977cadb3739?q=80&w=300&auto=format&fit=crop' },
  { id: 'cat-mirrors',   name: 'Mirrors',    img: 'https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?q=80&w=300&auto=format&fit=crop' },
  { id: 'cat-pottery',   name: 'Pottery',    img: 'https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?q=80&w=300&auto=format&fit=crop' },
  { id: 'cat-rugs',      name: 'Rugs',       img: 'https://images.unsplash.com/photo-1572123979839-3749e9973aba?q=80&w=300&auto=format&fit=crop' },
  { id: 'cat-cushions',  name: 'Cushions',   img: 'https://images.unsplash.com/photo-1624624494361-79693e25cb46?q=80&w=300&auto=format&fit=crop' },
];

/* Users who ask the OS for less motion get the content, not the choreography. */
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   MASKED WORD SPLITTER

   Wraps every word of a heading in an overflow-hidden mask so the
   words can be animated up from behind their own baseline. GSAP's
   SplitText is a paid plugin, so this does the one job we need.

   Walks child nodes rather than reading innerHTML, which keeps the
   <br /> line breaks in headings like "Transform Your<br />Home"
   intact — a naive .split(' ') on textContent would drop them.
   ============================================================ */
function splitIntoMaskedWords(el: HTMLElement) {
  if (el.dataset.splitDone === 'true') return;

  const out = document.createDocumentFragment();

  Array.from(el.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = (node.textContent ?? '').split(/(\s+)/);
      words.forEach((chunk) => {
        if (chunk === '') return;
        if (/^\s+$/.test(chunk)) {
          out.appendChild(document.createTextNode(' '));
          return;
        }
        const mask = document.createElement('span');
        mask.className = 'sr-word';
        const inner = document.createElement('span');
        inner.className = 'sr-inner';
        inner.textContent = chunk;
        mask.appendChild(inner);
        out.appendChild(mask);
      });
    } else {
      // <br>, <em>, etc. — carried through untouched
      out.appendChild(node.cloneNode(true));
    }
  });

  el.replaceChildren(out);
  el.dataset.splitDone = 'true';
}

/* ============================================================
   FALLBACK-SAFE IMAGE COMPONENT
   ============================================================ */
function SafeImg({
  src,
  fallback,
  alt,
  className,
  style,
}: {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => setImgSrc(fallback || `https://picsum.photos/seed/${alt.replace(/\s/g, '-')}/800/600`)}
      loading="lazy"
    />
  );
}

/* ============================================================
   MAISON / HUNARKAR PLACEHOLDER IMAGE SLOT COMPONENT
   ============================================================ */
function ReactImageSlot({
  placeholder,
}: {
  placeholder: string;
  shape?: 'rect' | 'rounded' | 'circle';
  radius?: number;
}) {
  const borderRadius = '0px'; // design system: sharp corners everywhere

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 'inherit',
        aspectRatio: '3/2',
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "rgba(0,0,0,.55)",
      }}
    >
      <div
        className="frame"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background: 'rgba(0,0,0,.04)',
          borderRadius: borderRadius,
        }}
      >
        <div
          className="empty"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            textAlign: 'center',
            padding: '12px',
            boxSizing: 'border-box',
            userSelect: 'none',
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.45 }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <div className="cap" style={{ maxWidth: '90%', fontWeight: 500, letterSpacing: '.01em', fontSize: '13px' }}>
            {placeholder}
          </div>
          <div className="sub" style={{ fontSize: '11px', opacity: 0.7 }}>
            or <u>browse files</u>
          </div>
        </div>
        <div
          className="ring"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            border: '1.5px dashed rgba(0,0,0,.25)',
            borderRadius: borderRadius,
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   NAV MENU DATA — single-column dropdown per category
   ============================================================ */
type NavLink    = { label: string; isNew?: boolean; img?: string };
type NavSection = { heading?: string; links: NavLink[] };
type NavMenu    = { tagline?: string; defaultImg: string; portraitImg: string; featured: { name: string; craft: string; }; editImg2: string; caption1: string; caption2: string; popularLabel?: string; sections: NavSection[] };

const IMG       = (id: string) => `https://images.unsplash.com/${id}?w=600&auto=format&fit=crop&q=80`;
const PORTRAIT  = (id: string) => `https://images.unsplash.com/${id}?w=400&h=600&auto=format&fit=crop&crop=faces%2Cfocal&q=80`;
const PORTEDIT  = (id: string) => `https://images.unsplash.com/${id}?w=400&h=520&auto=format&fit=crop&crop=faces%2Cfocal&q=80`;

const NAV_MENUS: Record<string, NavMenu> = {
  Estates: {
    tagline: 'Curated living spaces for the discerning Pakistani home.',
    defaultImg: IMG('photo-1564078516393-cf04bd966897'),
    portraitImg: PORTRAIT('photo-1564078516393-cf04bd966897'),
    featured: { name: 'The Drawing Room Edit', craft: 'Carved walnut & handwoven silk pieces' },
    editImg2: PORTEDIT('photo-1616137466211-f939a420be84'),
    caption1: 'The Curated Estate',
    caption2: 'Heritage Interiors',
    popularLabel: 'Estate Picks',
    sections: [{ links: [
      { label: 'Drawing Room Collections' },
      { label: 'Formal Dining Sets' },
      { label: 'Master Suite Pieces' },
      { label: 'Veranda & Courtyard' },
      { label: 'Bespoke Commissions' },
    ]}],
  },
  Living: {
    tagline: 'Handcrafted by master woodcarvers across Chiniot and Lahore.',
    defaultImg: IMG('photo-1691036561573-4b76998b60de'),
    portraitImg: PORTRAIT('photo-1691036561573-4b76998b60de'),
    featured: { name: 'Chinioti Sofa Collection', craft: 'Hand-carved walnut, silk upholstery' },
    editImg2: PORTEDIT('photo-1567538096630-e0c55bd6374c'),
    caption1: 'Master Woodcraft',
    caption2: 'The Living Edit',
    popularLabel: 'Room Essentials',
    sections: [{ links: [
      { label: 'Sofas & Settees' },
      { label: 'Lounge Chairs' },
      { label: 'Ottomans & Poufs' },
      { label: 'Coffee Tables' },
      { label: 'Console Tables' },
      { label: 'Display Cabinets' },
    ]}],
  },
  Dining: {
    tagline: 'Where every meal becomes a ceremony of craft.',
    defaultImg: IMG('photo-1555396273-367ea4eb4db5'),
    portraitImg: PORTRAIT('photo-1555396273-367ea4eb4db5'),
    featured: { name: 'Brass Dinner Service', craft: 'Hand-hammered in Lahore workshops' },
    editImg2: PORTEDIT('photo-1414235077428-338989a2e8c0'),
    caption1: 'The Art of Gathering',
    caption2: 'Craft at the Table',
    popularLabel: 'Table Essentials',
    sections: [{ links: [
      { label: 'Dining Tables' },
      { label: 'Dining Chairs' },
      { label: 'Pottery Dinner Sets', isNew: true },
      { label: 'Brass Cutlery' },
      { label: 'Tea Sets' },
    ]}],
  },
  Bed: {
    tagline: 'Rest in the tradition of Mughal-era comfort and artistry.',
    defaultImg: IMG('photo-1631049307264-da0ec9d70304'),
    portraitImg: PORTRAIT('photo-1631049307264-da0ec9d70304'),
    featured: { name: 'Carved Bed Frame', craft: 'Chiniot walnut with floral inlay motifs' },
    editImg2: PORTEDIT('photo-1505693416388-ac5ce068fe85'),
    caption1: 'Heritage Rest',
    caption2: 'Mughal-era Comfort',
    popularLabel: 'Sleep Essentials',
    sections: [{ links: [
      { label: 'Carved Bed Frames' },
      { label: 'Nightstands' },
      { label: 'Razai & Quilts' },
      { label: 'Throws & Blankets' },
      { label: 'Dressing Tables' },
    ]}],
  },
  Bath: {
    tagline: 'Hammam rituals reimagined for the contemporary home.',
    defaultImg: IMG('photo-1596178060671-7a80dc8059ea'),
    portraitImg: PORTRAIT('photo-1596178060671-7a80dc8059ea'),
    featured: { name: 'Hammam Linen Set', craft: 'Stone-washed Turkish cotton weave' },
    editImg2: PORTEDIT('photo-1540555700478-4be289fbecef'),
    caption1: 'The Hammam Ritual',
    caption2: 'Crafted for Serenity',
    popularLabel: 'Bath Essentials',
    sections: [{ links: [
      { label: 'Hammam Towels', isNew: true },
      { label: 'Bath Robes' },
      { label: 'Soap Dishes' },
      { label: 'Brass Fixtures' },
      { label: 'Vanity Mirrors' },
    ]}],
  },
  Outdoor: {
    tagline: 'From the courtyards of Lahore to your veranda.',
    defaultImg: 'https://media.istockphoto.com/id/2212038852/photo/patio-with-rustic-wooden-furniture-blue-shutters-and-wicker-lamps.webp?a=1&b=1&s=612x612&w=0&k=20&c=Hwen62gkH421CRXff96pIzmngjWd5XjB7UtQqnwSQeY=',
    portraitImg: 'https://media.istockphoto.com/id/2212038852/photo/patio-with-rustic-wooden-furniture-blue-shutters-and-wicker-lamps.webp?a=1&b=1&s=612x612&w=0&k=20&c=Hwen62gkH421CRXff96pIzmngjWd5XjB7UtQqnwSQeY=',
    featured: { name: 'Jhoola Swing Chair', craft: 'Hand-knotted jute cord, teak frame' },
    editImg2: PORTEDIT('photo-1621506821957-1b50ab7787a4'),
    caption1: 'The Courtyard Edit',
    caption2: 'Lahori Garden Living',
    popularLabel: 'Garden Picks',
    sections: [{ links: [
      { label: 'Jhoola & Swing Chairs' },
      { label: 'Garden Sofas' },
      { label: 'Outdoor Dining Sets' },
      { label: 'Planters & Clay Pots' },
      { label: 'Courtyard Fountains', isNew: true },
    ]}],
  },
  Lighting: {
    tagline: 'Hand-forged brass and fired clay, illuminating heritage.',
    defaultImg: IMG('photo-1524484485831-a92ffc0de03f'),
    portraitImg: PORTRAIT('photo-1524484485831-a92ffc0de03f'),
    featured: { name: 'Forged Brass Lantern', craft: 'Hand-hammered, Lahore brassware tradition' },
    editImg2: PORTEDIT('photo-1507473885765-e6ed057f782c'),
    caption1: 'Illuminated Heritage',
    caption2: 'The Brass Edit',
    popularLabel: 'Light the Space',
    sections: [{ links: [
      { label: 'Chandeliers' },
      { label: 'Pendant Lights' },
      { label: 'Table Lamps' },
      { label: 'Wall Sconces' },
      { label: 'Brass Lanterns' },
      { label: 'Diyas & Oil Lamps', isNew: true },
    ]}],
  },
  Textiles: {
    tagline: 'Woven in Sindh, dyed in Multan, finished entirely by hand.',
    defaultImg: IMG('photo-1779470703519-05af825e87cd'),
    portraitImg: PORTRAIT('photo-1779470703519-05af825e87cd'),
    featured: { name: 'Phulkari Wall Panel', craft: 'Embroidered in Multan, pure silk thread' },
    editImg2: PORTEDIT('photo-1773842298512-e49c9331cc3d'),
    caption1: 'Woven in Sindh',
    caption2: 'The Phulkari Story',
    popularLabel: "Weaver's Choice",
    sections: [{ links: [
      { label: 'Cushion Covers' },
      { label: 'Curtains & Drapes' },
      { label: 'Throws & Shawls' },
      { label: 'Ajrak Fabric' },
      { label: 'Phulkari Panels', isNew: true },
      { label: 'Wall Hangings' },
    ]}],
  },
  Rugs: {
    tagline: 'Knotted by master weavers across Balochistan and Sindh.',
    defaultImg: IMG('photo-1594040226829-7f251ab46d80'),
    portraitImg: PORTRAIT('photo-1594040226829-7f251ab46d80'),
    featured: { name: 'Balouchi Hand-knotted Kilim', craft: 'Natural wool, Balochistan provenance' },
    editImg2: PORTEDIT('photo-1600166898405-da9535204843'),
    caption1: 'Hand-knotted in Balochistan',
    caption2: 'The Kilim Edit',
    popularLabel: 'Rug Highlights',
    sections: [{ links: [
      { label: 'Kilim' },
      { label: 'Dhurrie' },
      { label: 'Balouchi' },
      { label: 'Sindhi Hand-knotted' },
      { label: 'Patchwork' },
      { label: 'Custom Rugs', isNew: true },
    ]}],
  },
  'Décor': {
    tagline: 'Objects of quiet beauty, made to outlast their makers.',
    defaultImg: IMG('photo-1594026112284-02bb6f3352fe'),
    portraitImg: PORTRAIT('photo-1594026112284-02bb6f3352fe'),
    featured: { name: 'Multani Pottery Vase', craft: 'Handpainted cobalt on fired clay' },
    editImg2: PORTEDIT('photo-1590605095243-072811dbe64c'),
    caption1: 'Objects of Beauty',
    caption2: 'The Multani Craft',
    popularLabel: 'Décor Picks',
    sections: [{ links: [
      { label: 'Multani Pottery' },
      { label: 'Onyx Sculptures' },
      { label: 'Handpainted Vases' },
      { label: 'Calligraphy Panels', isNew: true },
      { label: 'Miniature Art Frames' },
    ]}],
  },
  'Baby & Child': {
    tagline: 'Heirloom craftsmanship for the smallest members of the family.',
    defaultImg: IMG('photo-1503454537195-1dcabb73ffb9'),
    portraitImg: PORTRAIT('photo-1503454537195-1dcabb73ffb9'),
    featured: { name: 'Painted Toy Collection', craft: 'Non-toxic lacquered hardwood' },
    editImg2: PORTEDIT('photo-1515488042361-ee00e0ddd4e4'),
    caption1: 'Made for Little Ones',
    caption2: 'Heirloom Childhood',
    popularLabel: 'Baby Favourites',
    sections: [{ links: [
      { label: 'Cribs & Cots' },
      { label: 'Kids Chairs' },
      { label: 'Wooden Toys', isNew: true },
      { label: 'Crib Quilts & Bedding' },
      { label: 'Night Lights' },
    ]}],
  },
  Teen: {
    tagline: 'Contemporary craft for the next generation.',
    defaultImg: IMG('photo-1560185007-cde436f6a4d0'),
    portraitImg: PORTRAIT('photo-1560185007-cde436f6a4d0'),
    featured: { name: 'Sheesham Study Desk', craft: 'Sustainable hand-finished hardwood' },
    editImg2: PORTEDIT('photo-1598300042247-d088f8ab3a91'),
    caption1: 'Crafted for the Future',
    caption2: 'The Next Generation Edit',
    popularLabel: 'Teen Picks',
    sections: [{ links: [
      { label: 'Beds & Lofts' },
      { label: 'Study Desks' },
      { label: 'Poufs & Floor Seating' },
      { label: 'Duvet Sets' },
      { label: 'Wall Art & Calligraphy', isNew: true },
    ]}],
  },
  Sale: {
    tagline: 'Curated markdowns on exceptional Pakistani craft.',
    defaultImg: IMG('photo-1607082348824-0a96f2a4b9da'),
    portraitImg: PORTRAIT('photo-1607082348824-0a96f2a4b9da'),
    featured: { name: 'Curated Markdowns', craft: 'Select heritage pieces, reduced prices' },
    editImg2: PORTEDIT('photo-1483985988355-763728e1935b'),
    caption1: 'Curated Markdowns',
    caption2: 'Heritage at its Best',
    popularLabel: 'Best Deals',
    sections: [{ links: [
      { label: 'New Markdowns', isNew: true },
      { label: 'Living Room' },
      { label: 'Dining Room' },
      { label: 'Bedroom' },
      { label: 'Lighting' },
      { label: 'Final Clearance' },
    ]}],
  },
};

const CATEGORY_ROUTES: Record<string, string> = {
  Living: '/shop/living',
  Dining: '/dining',
  Textiles: '/textiles',
  Lighting: '/lighting',
};

const NAV_ITEMS: Array<{ name: string; extraClass?: string; href?: string }> = [
  { name: 'Estates' },
  { name: 'Living' },
  { name: 'Dining' },
  { name: 'Bed' },
  { name: 'Bath' },
  { name: 'Outdoor' },
  { name: 'Lighting' },
  { name: 'Textiles', href: '/textiles' },
  { name: 'Rugs' },
  { name: 'Décor' },
  { name: 'Baby & Child', extraClass: 'nav-baby-child' },
  { name: 'Teen',         extraClass: 'nav-baby-child' },
  { name: 'Sale',         extraClass: 'nav-sale' },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function Homepage({ initialProducts }: HomepageProps) {
  const toast = useToast();
  const [products] = useState<ProductItem[]>(initialProducts);

  /* Cart, currency and the bag drawer are shared site-wide and persisted —
     see lib/CartContext. Holding them here is what used to empty the bag on
     every navigation away from the homepage. */
  const {
    cart, addToCart, removeFromCart, updateQty, cartCount,
    cartOpen, setCartOpen,
    currency, setCurrency, formatPrice, getSubtotal,
  } = useCart();

  // Product ids whose image 404'd. Previously these fell back to picsum.photos,
  // which pulled a random third-party stock photo onto the page in production.
  const [failedImgs, setFailedImgs] = useState<Set<string>>(new Set());

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuClosing, setMenuClosing] = useState(false);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [previewImg, setPreviewImg] = useState('');
  const [previewVer, setPreviewVer] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bespokeOpen, setBespokeOpen] = useState(false);
  const [quickView, setQuickView] = useState<ProductItem | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const [bespokeStep, setBespokeStep] = useState(1);
  const [craftType, setCraftType] = useState('Blue Pottery');
  const [dimensions, setDimensions] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userWA, setUserWA] = useState('');

  const [heroSlide, setHeroSlide] = useState(0);
  const slideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lenisRef         = useRef<Lenis | null>(null);
  const menuTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ----------------------------------------------------------
     TACTILE 3D CARD TILT

     Transform ownership is split deliberately: GSAP's scroll reveal
     owns the transform on `.hk-product-card`, and the tilt owns the
     transform on the inner `.pc-tilt` layer. They used to be the same
     element, so hovering mid-reveal made the card snap — the mousemove
     handler was overwriting the transform GSAP was mid-way through
     animating.

     The tilt is driven through gsap.quickTo (a pre-compiled per-property
     setter) rather than by writing style.transform on every mousemove.
     That keeps it off the CSS transition that used to re-interpolate
     each write and make the tilt lag ~250ms behind the cursor.
  ---------------------------------------------------------- */
  const tiltSetters = useRef(new WeakMap<HTMLElement, {
    rotX: gsap.QuickToFunc;
    rotY: gsap.QuickToFunc;
    scale: gsap.QuickToFunc;
  }>());

  const getTilt = (layer: HTMLElement) => {
    let s = tiltSetters.current.get(layer);
    if (!s) {
      // GSAP names these rotationX / rotationY — the CSS spellings
      // (rotateX / rotateY) are silently ignored and the tilt never fires.
      const cfg = { duration: 0.5, ease: 'power3.out' };
      s = {
        rotX: gsap.quickTo(layer, 'rotationX', cfg),
        rotY: gsap.quickTo(layer, 'rotationY', cfg),
        scale: gsap.quickTo(layer, 'scale', { duration: 0.6, ease: 'power3.out' }),
      };
      tiltSetters.current.set(layer, s);
    }
    return s;
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return;
    const card = e.currentTarget;
    const layer = card.querySelector<HTMLElement>('.pc-tilt');
    if (!layer) return;

    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;  // 0→1
    const py = (e.clientY - rect.top) / rect.height;  // 0→1

    const t = getTilt(layer);
    t.rotX((0.5 - py) * 10);
    t.rotY((px - 0.5) * 10);
    t.scale(1.02);

    // Drive the specular sheen + the image's counter-parallax from the same
    // cursor position, as CSS custom properties, so no extra JS animation.
    card.style.setProperty('--mx', `${px * 100}%`);
    card.style.setProperty('--my', `${py * 100}%`);
    card.style.setProperty('--px', `${(px - 0.5) * -14}px`);
    card.style.setProperty('--py', `${(py - 0.5) * -14}px`);
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const layer = card.querySelector<HTMLElement>('.pc-tilt');
    if (!layer) return;
    const t = getTilt(layer);
    t.rotX(0);
    t.rotY(0);
    t.scale(1);
    card.style.setProperty('--px', '0px');
    card.style.setProperty('--py', '0px');
  };

  /* ----------------------------------------------------------
     LENIS + GSAP INIT
  ---------------------------------------------------------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /* ---- PRELOADER SEQUENCE ---- */
    const preloaderTl = gsap.timeline({
      onComplete: () => {
        const el = document.getElementById('preloader');
        if (el) el.style.display = 'none';
        initScrollEffects();
        // Start hero Ken Burns cycling after preloader completes
        slideIntervalRef.current = setInterval(() => {
          setHeroSlide(prev => (prev === 0 ? 1 : prev === 1 ? 2 : 0));
        }, 7000);
      }
    });

    preloaderTl
      .to('.loader-logo', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' })
      .to('.loader-sub', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .to('#loader-progress-bar', { width: '100%', duration: 1.8, ease: 'power1.inOut' }, '-=0.2')
      .to('.loader-content', { opacity: 0, y: -24, duration: 0.5, ease: 'power2.in' })
      .to('#preloader', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '-=0.15');

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    };
  }, []);

  /* The category marquee breaks out of its container to full width. It cannot
     use 100vw for that — 100vw counts the scrollbar gutter, so the strip would
     be a few px wider than the viewport and give the whole page a horizontal
     scrollbar. Measure the real gutter and expose it as --sbw. */
  useEffect(() => {
    const setScrollbarWidth = () => {
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--sbw', `${Math.max(0, sbw)}px`);
    };
    setScrollbarWidth();
    window.addEventListener('resize', setScrollbarWidth);
    return () => window.removeEventListener('resize', setScrollbarWidth);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false);
        setSearchOpen(false);
        closeBespoke();
        setQuickView(null);
        setMobileMenuOpen(false);
        setActiveMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* ----------------------------------------------------------
     INTERSECTION OBSERVER REVEAL EFFECT (MATCHING DESIGN.HTML)
  ---------------------------------------------------------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const els = document.querySelectorAll('[data-reveal]');
    els.forEach((el: any) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px) scale(0.985)';
      el.style.transition = 'opacity .9s cubic-bezier(.22,.61,.36,1), transform 1s cubic-bezier(.22,.61,.36,1)';
      el.style.willChange = 'opacity, transform';
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const delay = parseFloat(el.dataset.revealDelay || '0');
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'none';
          }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
    };
  }, [products]);

  /* ----------------------------------------------------------
     SCROLL EFFECTS
  ---------------------------------------------------------- */
  const initScrollEffects = () => {
    const reduced = prefersReducedMotion();

    /* Header scroll state */
    ScrollTrigger.create({
      start: 'top -60',
      onUpdate: (self) => {
        const hdr = document.getElementById('site-header');
        if (!hdr) return;
        if (self.scroll() > 60) hdr.classList.add('scrolled');
        else hdr.classList.remove('scrolled');
      }
    });

    /* ----------------------------------------------------------
       SCROLL PROGRESS — hairline gold rule across the very top.
       Scrubbed, so it tracks Lenis's eased scroll exactly rather
       than jumping. transform-only: no layout, no paint cost.
    ---------------------------------------------------------- */
    gsap.to('.scroll-progress-bar', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.35,
      },
    });

    /* ----------------------------------------------------------
       HERO — scale + dim on scroll

       As the hero leaves, the media dollies in and a scrim closes over
       it, so the content below arrives over a receding backdrop rather
       than a hard cut.

       Scaled on .hero-media-container, NOT on .hero-slide: the slides
       are already running the kenBurns CSS animations on `transform`,
       and animating that same property here would fight them. The
       parent composes with the children instead.

       Scrubbed against Lenis's eased scroll and clamped to the hero's
       own height, so it is fully resolved by the time the trust bar
       reaches the top.

       NOTE: design.md says "no parallax". This is a deliberate,
       user-approved exception — and it is a scale/opacity pair, not a
       layer-speed differential, so the hero never detaches from the
       scroll.
    ---------------------------------------------------------- */
    if (!reduced) {
      gsap.timeline({
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
        .to('.hero-media-container', { scale: 1.14, ease: 'none' }, 0)
        .to('.hero-dim', { opacity: 0.72, ease: 'none' }, 0);
    }

    /* ----------------------------------------------------------
       TRANSFORM PANEL — pinned card sequence

       The panel locks to the centre of the viewport and the three room
       cards fly in from the right, staggered, while the copy settles.
       Scrubbed, so the sequence is scrubbed by the user's scroll rather
       than played at them — you can scrub it backwards.

       matchMedia gates this to >=901px, which is exactly where
       .hp-transform-panel is still a row. Below that it stacks to a
       column, and pinning a stacked column just holds the viewport
       hostage for no payoff — so on mobile the cards simply appear.

       matchMedia's returned cleanup reverts the pin (and its pin-spacer)
       automatically if the breakpoint stops matching on resize.
    ---------------------------------------------------------- */
    if (!reduced) {
      const mmTransform = gsap.matchMedia();

      mmTransform.add('(min-width: 901px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.hp-transform-section',
            start: 'center center',
            end: '+=85%',
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.9,
          },
        });

        /* fromTo, not from: inside a *scrubbed* timeline a .from() tween
           re-applies its start state via immediateRender and can stick
           there permanently when it carries a position offset. That is
           exactly what happened to the "Explore More" anchor — it sat at
           opacity 0 forever while the paragraph beside it completed.
           Explicit endpoints leave nothing to infer. */
        tl.fromTo('.hp-transform-slot',
          { xPercent: 55, yPercent: 10, rotate: 4, opacity: 0 },
          { xPercent: 0, yPercent: 0, rotate: 0, opacity: 1, stagger: 0.16, ease: 'power3.out' },
          0,
        )
          .fromTo('.hp-transform-text p, .hp-transform-text a',
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.12, ease: 'power3.out' },
            0.1,
          );
      });
    }

    /* ----------------------------------------------------------
       MASKED HEADING REVEALS

       The page's signature move: each heading's words rise out of
       their own overflow mask, staggered left-to-right. Same
       "unveil from behind an edge" language as the product-card
       curtain wipe, so the page reads as one authored piece rather
       than a pile of separate fade-ins.
    ---------------------------------------------------------- */
    gsap.utils.toArray<HTMLElement>('[data-split]').forEach((heading) => {
      splitIntoMaskedWords(heading);
      const words = heading.querySelectorAll('.sr-inner');
      if (!words.length) return;

      if (reduced) {
        gsap.set(words, { yPercent: 0 });
        return;
      }

      gsap.fromTo(words,
        { yPercent: 118 },
        {
          yPercent: 0,
          duration: 1.15,
          stagger: 0.055,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            once: true,
          },
        },
      );
    });

    /* ----------------------------------------------------------
       EDITORIAL IMAGE WIPES

       Any [data-wipe] element unmasks from the bottom while settling
       out of a slight over-scale — the same reveal the product cards
       use, applied to the large editorial imagery.
    ---------------------------------------------------------- */
    gsap.utils.toArray<HTMLElement>('[data-wipe]').forEach((el) => {
      if (reduced) {
        gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 });
        return;
      }
      gsap.fromTo(el,
        { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.12 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          duration: 1.5,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        },
      );
    });

    /* Editorial split panels animation */
    document.querySelectorAll('.editorial-split').forEach((el) => {
      const media = el.querySelector('.editorial-media');
      const content = el.querySelector('.editorial-content');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      });
      
      if (media) {
        tl.fromTo(media, 
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
        );
      }
      
      if (content) {
        tl.fromTo(content.children,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
          '-=0.8'
        );
      }
    });

    /* ----------------------------------------------------------
       POPULAR PRODUCTS — reveal

       Each card unveils as an editorial curtain wipe: the image is
       masked from the bottom via clip-path while it settles out of a
       slight over-scale (a Ken Burns landing), then the copy ladders
       up beneath it. Cards stagger across the row.

       The old version faded a blur(10px) filter over full-size bitmaps
       and used toggleActions 'play reverse play reverse', so it re-ran
       the whole blur every time you scrolled back up. This runs once,
       and animates only compositor-friendly properties.
    ---------------------------------------------------------- */
    const cards = gsap.utils.toArray<HTMLElement>('.hk-product-card');

    if (prefersReducedMotion()) {
      gsap.set(cards, { opacity: 1, y: 0 });
      gsap.set('.pc-img-inner', { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 });
      gsap.set('.pc-meta > *', { opacity: 1, y: 0 });
    } else {
      cards.forEach((card, i) => {
        const img = card.querySelector('.pc-img-inner');
        const meta = card.querySelectorAll('.pc-meta > *');

        /* Each card triggers on ITSELF, not on the section.
           The grid is two rows now. Triggering the whole grid off
           '#popular-products' fired all eight cards at once — but row 2
           sits ~400px below the fold at that moment, so it played its
           reveal off-screen and you'd scroll down to find it already
           there. Per-card triggers mean row 2 unveils when row 2
           actually arrives.

           The delay keys off the column (i % COLS), not the index, so
           each row keeps its own left-to-right cascade instead of row 2
           inheriting a long dead delay from row 1. */
        const COLS = 4;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true,
          },
          delay: (i % COLS) * 0.12,
        });

        tl.fromTo(card,
          { opacity: 0, y: 44 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' },
        )
          .fromTo(img,
            { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.18 },
            { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.25, ease: 'expo.out' },
            '<0.05',
          )
          .fromTo(meta,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out' },
            '-=0.75',
          );
      });
    }

    /* New editorial block — generic fade-in on scroll (opacity 0→1, y 30→0) */
    gsap.utils.toArray<HTMLElement>('.hk-fade').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%'
          }
        }
      );
    });

    /* Discover Nature Inspired Furniture section animation */
    const heroSection = document.querySelector('.editorial-hero-section');
    if (heroSection) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: 'top 95%',
          end: 'bottom 35%',
          scrub: 1.2
        }
      });

      // 1. Reveal heading and paragraph first
      tl.fromTo('.editorial-hero-heading', 
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
      );
      
      tl.fromTo('.editorial-hero-para', 
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        '-=0.7'
      );

      // 2. Reveal floating products next (subtle, premium slide-in)
      tl.fromTo('.editorial-hero-left', 
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'power4.out' },
        '-=0.6'
      );

      tl.fromTo('.editorial-hero-right', 
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'power4.out' },
        '-=1.2'
      );

      // 3. Staggered reveal of the bottom curved room panels
      tl.fromTo('.hero-room-left', 
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.4, ease: 'power4.out' },
        '-=0.8'
      );

      tl.fromTo('.hero-room-right', 
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.4, ease: 'power4.out' },
        '-=1.4'
      );

      tl.fromTo('.hero-room-mid', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: 'power4.out' },
        '-=1.2'
      );
    }

    /* Premium Split Text reveals */
    document.querySelectorAll('.reveal-trigger').forEach((el) => {
      const targets = el.querySelectorAll('.reveal-inner');
      if (targets.length > 0) {
        gsap.fromTo(targets,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
            }
          }
        );
      }
    });

    /* Lenis-inspired Horizontal Scroll Showcase */
    const track = document.querySelector('.horizontal-track') as HTMLElement;
    const scrollSection = document.querySelector('.heritage-scroll-section') as HTMLElement;
    if (track && scrollSection) {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 992px)", () => {
        const getScrollAmount = () => {
          return track.scrollWidth - window.innerWidth;
        };

        const pinTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.heritage-scroll-section',
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${getScrollAmount()}`,
            invalidateOnRefresh: true,
          }
        });

        pinTimeline.to(track, {
          x: () => -getScrollAmount(),
          ease: 'none',
        });

        // Add premium image horizontal parallax inside cards
        const cards = track.querySelectorAll('.category-card-item');
        cards.forEach((card) => {
          const pWrap = card.querySelector('.horizontal-card-img-parallax') as HTMLElement;
          if (pWrap) {
            pinTimeline.fromTo(pWrap, 
              { xPercent: -15 },
              { xPercent: 15, ease: 'none' },
              0
            );
          }
        });
      });
    }
  };

  /* ----------------------------------------------------------
     RESET PREVIEW IMAGE WHEN ACTIVE MENU CHANGES
  ---------------------------------------------------------- */
  useEffect(() => {
    if (activeMenu && NAV_MENUS[activeMenu]) {
      setPreviewImg(NAV_MENUS[activeMenu].portraitImg);
      setPreviewVer(v => v + 1);
    }
  }, [activeMenu]);

  /* ----------------------------------------------------------
     FORCE HEADER LIGHT STATE WHEN MEGA-MENU IS OPEN
  ---------------------------------------------------------- */
  useEffect(() => {
    const hdr = document.getElementById('site-header');
    if (!hdr) return;
    if (mobileMenuOpen) {
      hdr.classList.add('scrolled');
    } else {
      if (typeof window !== 'undefined' && window.scrollY <= 60) {
        hdr.classList.remove('scrolled');
      }
    }
  }, [mobileMenuOpen]);

  /* ----------------------------------------------------------
     LENIS PAUSE ON OVERLAYS
  ---------------------------------------------------------- */
  useEffect(() => {
    if (!lenisRef.current) return;
    const anyOpen = cartOpen || searchOpen || bespokeOpen || !!quickView || mobileMenuOpen;
    if (anyOpen) {
      lenisRef.current.stop();
      document.body.classList.add('no-scroll');
    } else {
      lenisRef.current.start();
      document.body.classList.remove('no-scroll');
    }
  }, [cartOpen, searchOpen, bespokeOpen, quickView, mobileMenuOpen]);

  const openMenu = (name: string, left: number) => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    menuTimerRef.current = setTimeout(() => {
      setDropdownLeft(left);
      setActiveMenu(name);
      setMobileMenuOpen(false);
    }, 150);
  };

  const closeMenu = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setMenuClosing(true);
    menuTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
      setMenuClosing(false);
    }, 150);
  };

  const scheduleClose = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    menuTimerRef.current = setTimeout(closeMenu, 140);
  };

  const cancelClose = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setMenuClosing(false);
  };

  /* ----------------------------------------------------------
     BESPOKE SUBMIT
  ---------------------------------------------------------- */
  const handleBespokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bespoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ craft: craftType, dimensions, userName, userEmail, userWhatsApp: userWA })
      });
      const data = await res.json();
      if (data.success) {
        const msg = `Assalam-u-Alaikum! I placed a custom commission request via Hunarkar website.\n\nCraft: ${craftType}\nDetails: ${dimensions}\nName: ${userName}\nEmail: ${userEmail}`;
        window.open(`https://wa.me/923000000000?text=${encodeURIComponent(msg)}`, '_blank');
        closeBespoke();
      } else {
        toast.error(data.error || 'We could not send your commission request.');
      }
    } catch (err: any) {
      toast.error(`Network error — ${err.message}. Please try again.`);
    }
  };

  const closeBespoke = () => {
    setBespokeOpen(false);
    setBespokeStep(1);
    setCraftType('Blue Pottery');
    setDimensions('');
    setUserName('');
    setUserEmail('');
    setUserWA('');
  };

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */
  return (
    <div className="page-scope page-home" data-page="page-home">
      {/* =====================================================
           PRELOADER
         ===================================================== */}
      <div id="preloader">
        <div className="loader-content">
          <div className="loader-logo">Hunarkar</div>
          <div className="loader-sub">Where Craft Becomes Heritage</div>
          <div className="loader-progress-track">
            <div id="loader-progress-bar" />
          </div>
        </div>
      </div>

      {/* =====================================================
           FIXED HEADER — RH-style two-tier
         ===================================================== */}
      {/* Scroll progress — hairline gold rule pinned above the header */}
      <div className="scroll-progress" aria-hidden="true">
        <div className="scroll-progress-bar" />
      </div>

      <header id="site-header">
        {/* Top bar: left icons · logo · right actions */}
        <div className="header-top-bar">
          {/* Left */}
          <div className="header-left">
            <button
              id="mobile-menu-btn"
              className={`header-icon-btn menu-toggle${mobileMenuOpen ? ' open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span className="hamburger-icon"><span /><span /><span /></span>
            </button>
            <button
              id="search-open-btn"
              className="header-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>

          {/* Center Logo */}
          <div className="header-logo-wrap">
            <a href="#" className="logo" id="main-logo">
              H<em>unarkar</em>
            </a>
          </div>

          {/* Right */}
          <div className="header-right">
            {/* Currency toggle — PKR default for the Pakistan market, USD opt-in for diaspora */}
            <button
              className="currency-toggle"
              onClick={() => setCurrency(currency === 'PKR' ? 'USD' : 'PKR')}
              aria-label={`Currency: ${currency}. Switch to ${currency === 'PKR' ? 'USD' : 'PKR'}`}
            >
              <span className={currency === 'PKR' ? 'active' : ''}>PKR</span>
              <span className="currency-sep">/</span>
              <span className={currency === 'USD' ? 'active' : ''}>USD</span>
            </button>

            {/* Interior Design text link — mirrors RH's right-side text link */}
            <button
              className="header-interior-design"
              onClick={() => setBespokeOpen(true)}
            >
              Interior Design
            </button>

            {/* Profile icon */}
            <button
              className="header-icon-btn"
              onClick={() => toast.info('Profile and membership settings are coming soon.')}
              aria-label="User Account"
            >
              <i className="fa-regular fa-user" />
            </button>

            {/* Bag */}
            <div className="cart-icon-wrap">
              <button
                id="cart-open-btn"
                className="header-icon-btn"
                onClick={() => setCartOpen(true)}
                aria-label="Shopping bag"
              >
                <i className="fa-solid fa-bag-shopping" />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Category nav bar — each item opens its own single-column dropdown */}
        <nav className="header-nav-bar" aria-label="Main navigation" onMouseLeave={scheduleClose}>
          {NAV_ITEMS.map(({ name, extraClass, href }) => (
            <button
              key={name}
              className={`nav-category-link${extraClass ? ` ${extraClass}` : ''}${activeMenu === name ? ' nav-active' : ''}`}
              onMouseEnter={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                openMenu(name, rect.left);
              }}
              onMouseLeave={scheduleClose}
              onClick={(e) => {
                if (href) { window.location.href = href; return; }
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                activeMenu === name ? closeMenu() : openMenu(name, rect.left);
              }}
            >
              {name}
            </button>
          ))}
        </nav>
      </header>

      {/* =====================================================
           CATEGORY DROPDOWN — full-width editorial layout
         ===================================================== */}
      {activeMenu && NAV_MENUS[activeMenu] && (
        <>
          <div className="cat-backdrop" onClick={closeMenu} />
          <div
            className={`cat-dropdown${menuClosing ? ' closing' : ''}`}
            data-lenis-prevent
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="cat-inner">
              {/* ── Left: heading + links ── */}
              <div className="cat-links-col">
                <div className="cat-menu-heading">{activeMenu}</div>
                <a href={CATEGORY_ROUTES[activeMenu] ?? '#new-arrivals'} className="cat-shopall" onClick={() => setActiveMenu(null)}>
                  Shop All {activeMenu}
                </a>
                <p className="cat-popular-label">{NAV_MENUS[activeMenu].popularLabel ?? 'Popular'}</p>
                {(() => {
                  let idx = 0;
                  return NAV_MENUS[activeMenu].sections.map((section, si) => (
                    <div key={si} className="cat-section">
                      {section.heading && <div className="cat-section-heading">{section.heading}</div>}
                      <ul className="cat-link-list">
                        {section.links.map((link) => {
                          const i = idx++;
                          const categorySlug = activeMenu.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                          return (
                            <li key={link.label} style={{ '--i': i } as React.CSSProperties}>
                              <a
                                href={`/${categorySlug}`}
                                className="cat-link"
                                onClick={() => setActiveMenu(null)}
                                onMouseEnter={() => {
                                  const src = link.img || NAV_MENUS[activeMenu!].portraitImg;
                                  setPreviewImg(src);
                                  setPreviewVer(v => v + 1);
                                }}
                                onMouseLeave={() => {
                                  setPreviewImg(NAV_MENUS[activeMenu!].portraitImg);
                                  setPreviewVer(v => v + 1);
                                }}
                              >
                                {link.label}
                                {link.isNew && <span className="cat-new-badge">NEW</span>}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ));
                })()}
              </div>

              {/* ── Separator ── */}
              <div className="cat-col-sep" />

              {/* ── Right: 2 editorial image cards ── */}
              <div className="cat-editorial-cards">
                <div className="cat-ed-card">
                  <div className="cat-ed-img-wrap">
                    {previewImg && <img key={previewVer} src={previewImg} alt="" className="cat-preview-img" />}
                    <div className="cat-ed-overlay">
                      <span className="cat-ed-caption">{NAV_MENUS[activeMenu].caption1}</span>
                    </div>
                  </div>
                  <a 
                    href={`/${activeMenu.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} 
                    className="cat-ed-link" 
                    onClick={() => setActiveMenu(null)}
                  >
                    Shop the Edit →
                  </a>
                </div>
                <div className="cat-ed-card">
                  <div className="cat-ed-img-wrap">
                    <img src={NAV_MENUS[activeMenu].editImg2} alt="" />
                    <div className="cat-ed-overlay">
                      <span className="cat-ed-caption">{NAV_MENUS[activeMenu].caption2}</span>
                    </div>
                  </div>
                  <a 
                    href={`/${activeMenu.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} 
                    className="cat-ed-link" 
                    onClick={() => setActiveMenu(null)}
                  >
                    Explore →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================
           HAMBURGER DROPDOWN — full-width 4-col panel
         ===================================================== */}
      {mobileMenuOpen && (
        <div className="ham-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className={`ham-dropdown${mobileMenuOpen ? ' open' : ''}`} data-lenis-prevent>
        <div className="ham-inner">
          {/* Col 1 — Products */}
          <div className="ham-col">
            <div className="ham-col-img-wrap">
              <Image src="https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600&auto=format&fit=crop&q=80" alt="Our Products" fill sizes="320px" />
            </div>
            <div className="ham-col-eyebrow">Our</div>
            <div className="ham-col-heading">Products</div>
            <a href="#new-arrivals" className="ham-col-shopall" onClick={() => setMobileMenuOpen(false)}>Shop All</a>
            <ul className="ham-col-links">
              <li><a href="#new-arrivals" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Blue Pottery</a></li>
              <li><a href="/textiles" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Ajrak Textiles</a></li>
              <li><a href="#new-arrivals" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Woodcarving</a></li>
              <li><a href="#new-arrivals" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Khussa Footwear</a></li>
              <li><a href="#new-arrivals" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Brass & Onyx</a></li>
              <li><a href="#new-arrivals" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Ralli Quilts</a></li>
            </ul>
          </div>

          {/* Col 2 — Artisans */}
          <div className="ham-col">
            <div className="ham-col-img-wrap">
              <Image src="https://images.unsplash.com/photo-1590605095243-072811dbe64c?w=600&auto=format&fit=crop&q=80" alt="Our Artisans" fill sizes="320px" />
            </div>
            <div className="ham-col-eyebrow">Our</div>
            <div className="ham-col-heading">Artisans</div>
            <a href="#" className="ham-col-shopall" onClick={() => setMobileMenuOpen(false)}>Meet All Artisans</a>
            <ul className="ham-col-links">
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Sindhi Block Printers</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Lahori Woodcarvers</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Multani Potters</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Punjab Phulkari Makers</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Balochi Weavers</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Kashmiri Embroiderers</a></li>
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div className="ham-col">
            <div className="ham-col-img-wrap">
              <Image src="/service.jpg" alt="Our Services" fill sizes="320px" />
            </div>
            <div className="ham-col-eyebrow">Our</div>
            <div className="ham-col-heading">Services</div>
            <a href="#" className="ham-col-shopall" onClick={() => { setMobileMenuOpen(false); setBespokeOpen(true); }}>Start a Commission</a>
            <ul className="ham-col-links">
              <li><a href="#" className="ham-col-link" onClick={() => { setMobileMenuOpen(false); setBespokeOpen(true); }}>Bespoke Commissions</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Interior Styling</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Corporate Gifting</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Heritage Sourcing</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>White-Glove Delivery</a></li>
            </ul>
          </div>

          {/* Col 4 — Heritage */}
          <div className="ham-col">
            <div className="ham-col-img-wrap">
              <Image src="https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&auto=format&fit=crop&q=80" alt="Our Heritage" fill sizes="320px" />
            </div>
            <div className="ham-col-eyebrow">Our</div>
            <div className="ham-col-heading">Heritage</div>
            <a href="#" className="ham-col-shopall" onClick={() => setMobileMenuOpen(false)}>Explore Heritage</a>
            <ul className="ham-col-links">
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>400 Years of Craft</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Artisan Stories</a></li>
              <li><a href="#instagram-section" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>The Hunarkar Journal</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Provenance & Process</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>About Us</a></li>
            </ul>
          </div>
        </div>

        {/* Footer bar */}
        <div className="ham-footer-bar">
          <a href="#" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Customer Experience</a>
          <a href="#" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Sign up for Emails</a>
          <a href="#instagram-section" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Heritage Journal</a>
          <a href="https://wa.me/923000000000" target="_blank" rel="noreferrer" className="ham-footer-link">WhatsApp Us</a>
          <a href="#" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Privacy Notice</a>
          <a href="#" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Careers</a>
        </div>
      </div>

      {/* =====================================================
           HERO — Cinematic fullscreen
         ===================================================== */}
      <section id="hero">
        <div className="hero-media-container">
          {/* fill + sizes=100vw: the .hero-slide class already supplies
              position/inset/object-fit, so rendering is unchanged — only the
              bytes on the wire differ. Slide 1 is the LCP element. */}
          <Image
            src="/hk1.jpg"
            alt="Hunarkar artisan living collection"
            fill
            sizes="100vw"
            preload
            quality={85}
            className={`hero-slide hero-slide-1${heroSlide === 0 ? ' active' : ''}`}
          />
          <Image
            src="/hk2.jpg"
            alt="Hunarkar outdoor artisan collection"
            fill
            sizes="100vw"
            quality={85}
            className={`hero-slide hero-slide-2${heroSlide === 1 ? ' active' : ''}`}
          />
          <Image
            src="/hk3.avif"
            alt="Hunarkar contemporary interior collection"
            fill
            sizes="100vw"
            quality={85}
            className={`hero-slide hero-slide-3${heroSlide === 2 ? ' active' : ''}`}
          />
        </div>
        <div className="hero-overlay" />
        {/* Separate scrim so the scroll dim never disturbs .hero-overlay's
            gradient, which is tuned around the images' baked-in text. */}
        <div className="hero-dim" aria-hidden="true" />
      </section>

      <main>
        {/* ===================================================
             TRUST BAR — COD / returns / delivery / authenticity
             Local-market reassurance directly under the hero
           =================================================== */}
        <div className="trust-bar" aria-label="Shopping assurances">
          <div className="trust-item">
            <i className="fa-solid fa-hand-holding-dollar" />
            <div className="trust-text">
              <span className="trust-title">Cash on Delivery</span>
              <span className="trust-sub">Pay when it arrives</span>
            </div>
          </div>
          <div className="trust-item">
            <i className="fa-solid fa-arrow-rotate-left" />
            <div className="trust-text">
              <span className="trust-title">7-Day Exchange</span>
              <span className="trust-sub">Hassle-free returns</span>
            </div>
          </div>
          <div className="trust-item">
            <i className="fa-solid fa-truck-fast" />
            <div className="trust-text">
              <span className="trust-title">Delivery Nationwide</span>
              <span className="trust-sub">3–5 days across Pakistan</span>
            </div>
          </div>
          <div className="trust-item">
            <i className="fa-solid fa-certificate" />
            <div className="trust-text">
              <span className="trust-title">Certified Authentic</span>
              <span className="trust-sub">Handmade, guaranteed</span>
            </div>
          </div>
        </div>

        {/* ===================================================
             SHOP THE ROOM — interactive hotspot section
           =================================================== */}
        <ShopTheRoom />

        <style dangerouslySetInnerHTML={{ __html: `
          /* .category-circle-hover retired — the category circles are now
             .hp-cat-circle in globals.css (marquee). */
          .product-card-hover {
            transition: transform .5s cubic-bezier(.22,.61,.36,1), border-color .5s;
          }
          .product-card-hover:hover {
            transform: translateY(-6px);
            border-color: var(--color-border);
          }
          .wishlist-icon-hover {
            transition: .3s;
            background: transparent;
            color: #7A6E60; /* TOKEN-DRIFT */
            border: 1px solid var(--color-border);
          }
          .wishlist-icon-hover:hover {
            background: var(--color-espresso);
            color: #F7F0E6; /* TOKEN-DRIFT */
            border-color: var(--color-espresso);
          }
          .view-all-btn-hover {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            border: 1px solid var(--color-border);
            color: var(--color-espresso);
            transition: .35s;
            background: transparent;
            text-decoration: none;
          }
          .view-all-btn-hover:hover {
            background: var(--color-espresso);
            color: #F7F0E6; /* TOKEN-DRIFT */
            border-color: var(--color-espresso);
            gap: 16px;
          }
          .transform-btn-hover {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            transition: .35s;
          }
          .transform-btn-hover:hover {
            gap: 18px;
          }
          .sale-btn-hover {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: .35s;
          }
          .sale-btn-hover:hover {
            gap: 16px;
          }
          @keyframes kb {
            0% { transform: scale(1); }
            100% { transform: scale(1.09); }
          }
          .hero-free-img {
            width: 180px;
            height: auto;
            object-fit: contain;
            flex-shrink: 0;
            transition: transform 0.8s var(--ease-out);
          }
          .hero-free-img:hover {
            transform: scale(1.05);
          }
          @media (max-width: 991px) {
            .hero-free-img {
              width: 120px;
            }
          }
          @media (max-width: 767px) {
            .hero-free-img {
              display: none;
            }
          }
          .editorial-hero-left, .editorial-hero-right, .editorial-hero-heading, .editorial-hero-para, .hero-room-left, .hero-room-mid, .hero-room-right {
            opacity: 0;
            will-change: transform, opacity;
          }
          /* Product-card styles now live in globals.css under
             "POPULAR PRODUCTS — card interaction". */
          .premium-text-btn::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: var(--color-espresso);
            transform: scaleX(0.4);
            transform-origin: bottom left;
            transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .premium-text-btn:hover::after {
            transform: scaleX(1);
          }
          .premium-text-btn:hover i {
            transform: translateX(4px);
          }
        `}} />

        {/* ===================================================
             SHOP BY CATEGORY — craft categories grid
           =================================================== */}
        <section className="hp-category-section" id="shop-by-category">
          <h2 data-split="" className="hp-section-heading" style={{ textAlign: 'center', marginBottom: '24px' }}>Shop by Category</h2>

          {/* Continuous marquee. The list is rendered TWICE and the track slides
              exactly -50%, so the second copy lands where the first began and the
              loop is seamless. The duplicate is aria-hidden and untabbable — it is
              a visual artefact of the loop, not twelve more categories. */}
          <div className="hp-cat-marquee">
            <div className="hp-cat-track">
              {[...CATEGORY_CIRCLES, ...CATEGORY_CIRCLES].map((cat, i) => {
                const isClone = i >= CATEGORY_CIRCLES.length;
                return (
                  <a
                    key={`${cat.id}-${i}`}
                    href={`/shop?category=${cat.id}`}
                    className="hp-cat-item"
                    aria-hidden={isClone || undefined}
                    tabIndex={isClone ? -1 : undefined}
                  >
                    <div className="hp-cat-circle">
                      {/* eager, not lazy: the track is 4272px wide, so most circles
                          sit far outside the viewport and would each pop in as an
                          empty disc the moment the marquee carried them into view.
                          They are ~128px thumbnails and the clone half dedupes to
                          the same 12 URLs, so there is nothing to defer. */}
                      <Image
                        src={cat.img}
                        alt={isClone ? '' : cat.name}
                        fill
                        sizes="134px"
                        loading="eager"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <span className="hp-cat-label">{cat.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================
             EDITORIAL HERO — Discover Nature Inspired Furniture
           =================================================== */}
        <section className="editorial-hero-section" style={{ background: '#ffffff', marginTop: '10px', padding: '15px 0 0 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 40px 17px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', position: 'relative' }}>
              <Image
                src="/lefttable.png"
                alt="Side table + vase"
                width={370}
                height={370}
                sizes="180px"
                className="hero-free-img editorial-hero-left"
              />
              <div className="editorial-hero-heading" style={{ textAlign: 'center' }}>
                <h1 className="hp-editorial-h1">Discover Nature<br />Inspired Furniture</h1>
              </div>
              <Image
                src="/rightchair.png"
                alt="Accent chair"
                width={296}
                height={370}
                sizes="180px"
                className="hero-free-img editorial-hero-right"
              />
            </div>
            <p className="editorial-hero-para" style={{ maxWidth: '560px', margin: '2px auto 14px', textAlign: 'center', fontSize: '15px', fontWeight: 300, lineHeight: 1.75, color: '#6E655B' /* TOKEN-DRIFT */ }}>Crafted from nature, designed for modern living. Experience timeless furniture that brings warmth, comfort, and elegance into every corner of your home.</p>
          </div>
          
          {/* Curved Room Images Panel */}
          <div style={{ width: '100%', background: '#ffffff', overflow: 'hidden', marginTop: '-45px' }}>
            <div 
              style={{
                width: '100%',
                aspectRatio: '1893/600',
                maxHeight: '430px',
                overflow: 'hidden',
                clipPath: 'url(#lens-clip)',
                WebkitClipPath: 'url(#lens-clip)',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
              }}
            >
              {/* Explicit width/height rather than `fill` so the DOM stays a bare
                  <img> — these are GSAP reveal targets and the parent carries the
                  lens clip-path, so no wrapper div can be introduced here. */}
              <Image
                src="/chaise lounge/g1.jpg"
                alt="Beige room scene"
                width={1588}
                height={1191}
                sizes="33vw"
                className="hero-room-left"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Image
                src="/chaise lounge/g2.jpg"
                alt="Grey room scene"
                width={1588}
                height={1270}
                sizes="33vw"
                className="hero-room-mid"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Image
                src="/chaise lounge/g3.jpg"
                alt="White room scene"
                width={1588}
                height={1191}
                sizes="33vw"
                className="hero-room-right"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
          
          <svg width="0" height="0" style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <clipPath id="lens-clip" clipPathUnits="objectBoundingBox">
                <path d="M 0,0 Q 0.5,0.20 1,0 L 1,1 Q 0.5,0.80 0,1 Z" />
              </clipPath>
            </defs>
          </svg>
        </section>

        {/* ===================================================
             POPULAR PRODUCTS — product grid
           =================================================== */}
        <section id="popular-products" className="hp-product-section">
          <h2 data-split="" className="hp-section-heading" style={{ textAlign: 'center', marginBottom: '52px' }}>Popular Products</h2>
          {/* 8 = two full rows of 4. The DB holds 15, so this never leaves a
              ragged trailing row at the 4-col desktop or 2-col mobile breakpoint. */}
          <div className="hp-product-grid">
            {products.slice(0, 8).map((product, idx) => (
              <div
                key={product.id}
                className="hk-product-card"
                onClick={() => setQuickView(product)}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                {/* The tilt lives on its own layer so it never collides with
                    the transform GSAP animates on .hk-product-card above. */}
                <div className="pc-tilt">
                  <div className="product-image-container">
                    {/* Curtain-wipe + Ken Burns settle target */}
                    <div className="pc-img-inner">
                      {product.img && !failedImgs.has(product.id) ? (
                        <Image
                          src={product.img}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 290px"
                          className="product-card-img"
                          style={{ objectFit: 'cover' }}
                          onError={() =>
                            setFailedImgs((prev) => new Set(prev).add(product.id))
                          }
                        />
                      ) : (
                        <ReactImageSlot placeholder={product.name} shape="rounded" radius={12} />
                      )}
                    </div>

                    {/* Specular highlight — tracks the cursor via --mx/--my */}
                    <div className="pc-sheen" aria-hidden="true" />

                    <div className="quick-view-overlay">
                      <span className="pc-quickview-pill">Quick View</span>
                    </div>

                    <button
                      className={`wishlist-btn-premium pc-wishlist ${wishlist.includes(product.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      aria-label="Save to wishlist"
                      aria-pressed={wishlist.includes(product.id)}
                    >
                      <i className={wishlist.includes(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
                    </button>
                  </div>

                  <div className="pc-meta">
                    <div className="pc-eyebrow">
                      {product.name.includes('Bench') ? 'Chinioti Woodcraft' : product.name.includes('Brass') ? 'Lahori Brasswork' : 'Rawalpindi Handcrafted'}
                    </div>
                    <div className="pc-name">{product.name}</div>
                    <div className="pc-price">{formatPrice(product.usdPrice, product.pkrPrice)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================
             VIEW ALL — Link to Shop
           =================================================== */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 40px 0' }}>
          <a
            href="/shop"
            className="premium-text-btn"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '13px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-espresso)',
              textDecoration: 'none',
              paddingBottom: '6px',
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            View All Products <i className="fa-solid fa-arrow-right" style={{ fontSize: '11px', transition: 'transform 0.3s ease' }} />
          </a>
        </div>

        {/* ===================================================
             TRANSFORM YOUR HOME — dark accent panel
           =================================================== */}
        <section className="hp-transform-section">
          <div data-reveal="" className="hp-transform-panel">
            <div className="hp-transform-text">
              <h2 data-split="" className="hp-transform-title">Transform Your<br />Home</h2>
              <p className="hp-transform-desc">Decorate every room with thoughtfully designed furniture made for modern living.</p>
              <a
                href="#popular-products"
                className="transform-btn-hover hp-transform-cta"
              >
                Explore More <span style={{ fontSize: '16px' }}>→</span>
              </a>
            </div>
            {/* Collage: slot 1 is the tall hero (spans both grid rows), slots 2
                and 3 stack beside it as landscape crops. */}
            <div className="hp-transform-imgs">
              <div className="hp-transform-slot">
                {/* h1-web.jpg, not h1.png. The 5MB/1588x2382 PNG source made the
                    image optimizer hang *deterministically* at w=750 — the exact
                    candidate a DPR-3 phone picks for this slot — returning zero
                    bytes after a 60s timeout while every other width served fine.
                    A 444KB JPEG of the same photo resolves it. The original PNG
                    is left in place, unused. */}
                <Image
                  src="/Natural Leather Bench/h1.jpg"
                  alt="Woven leather bench in a sunlit courtyard"
                  fill
                  sizes="(max-width: 900px) 55vw, 300px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="hp-transform-slot">
                {/* Was the Brown Truffle velvet macro — shot on grey concrete, it
                    read as a cold block between two warm images on the sandstone
                    panel. This courtyard shares their terracotta/olive palette. */}
                <Image
                  src="/handmade  Kilim Bench/l4.jpg"
                  alt="Kilim-topped bench in a golden-hour courtyard"
                  fill
                  sizes="(max-width: 900px) 45vw, 260px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="hp-transform-slot">
                <Image
                  src="/Rattan Bench/u1.jpg"
                  alt="Caned rattan bench against a sunlit wall"
                  fill
                  sizes="(max-width: 900px) 45vw, 260px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
             SUMMER SALE — split banner
           =================================================== */}
        <section className="hp-sale-section">
          <div data-reveal="" className="hp-sale-panel">
            <div className="hp-sale-text">
              <span style={{ fontSize: '15px', fontWeight: 400, color: '#6E5B42' /* TOKEN-DRIFT */ }}>Summer Sale</span>
              <h2 className="hp-sale-title" data-split="">Upto 30% Off</h2>
              <span style={{ fontSize: '15px', fontWeight: 300, color: '#6E5B42' /* TOKEN-DRIFT */ }}>On Selected Collection</span>
              <a
                href="#popular-products"
                className="sale-btn-hover hp-sale-btn"
              >
                Shop Now <span style={{ fontSize: '16px' }}>→</span>
              </a>
            </div>
            <div className="hp-sale-img">
              <Image
                src="/handwoven Palm Leaf Bench/f2.jpg"
                alt="Handwoven palm leaf bench in a bright, airy interior"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </section>

        {/* ===================================================
             DOWNLOAD THE APP — image banner
           =================================================== */}
        <section className="hp-app-section">
          <div data-reveal="" className="hp-app-panel">
            <div className="hp-app-media">
              {/* Decorative backdrop behind the scrim — alt="" keeps it out of the
                  a11y tree. The panel is capped by .hp-app-section's 1240px
                  max-width, so it never actually renders at 100vw. */}
              <Image
                src="/handmade  Kilim Bench/l1.jpg"
                alt=""
                fill
                sizes="(max-width: 1320px) 100vw, 1160px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="hp-app-scrim" />
            <div className="hp-app-content">
              <h2 className="hp-app-title" data-split="">Download The App</h2>
              <p className="hp-app-desc">Find modern furniture, personalized recommendations, and exclusive app-only offers — all in one place.</p>
              <div className="hp-app-btns">
                <span className="hp-app-btn hp-app-btn--primary">App Store</span>
                <span className="hp-app-btn hp-app-btn--ghost">Google Play</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* =====================================================
           FOOTER
         ===================================================== */}
      <footer style={{ background: '#241E18' /* TOKEN-DRIFT */, padding: '64px 40px 34px' }} id="site-footer">
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '48px' }}>
          <div style={{ maxWidth: '300px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '27px', fontWeight: 600, color: 'var(--color-linen)' }}>
              Hunarkar<span style={{ color: '#C79A63' /* TOKEN-DRIFT */ }}>.</span>
            </div>
            <p style={{ marginTop: '14px', fontSize: '13.5px', fontWeight: 300, lineHeight: 1.75, color: '#A89A86' /* TOKEN-DRIFT */ }}>
              Preserving centuries-old heritage techniques by connecting Pakistan's master craftsmen directly with contemporary interiors worldwide.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '72px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#EDE2D2' /* TOKEN-DRIFT */, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Shop</span>
              <a href="#shop-by-category" style={{ fontSize: '13.5px', color: '#A89A86' /* TOKEN-DRIFT */ }}>Living Room</a>
              <a href="#shop-by-category" style={{ fontSize: '13.5px', color: '#A89A86' /* TOKEN-DRIFT */ }}>Bedroom</a>
              <a href="#shop-by-category" style={{ fontSize: '13.5px', color: '#A89A86' /* TOKEN-DRIFT */ }}>Lighting</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#EDE2D2' /* TOKEN-DRIFT */, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Company</span>
              <span style={{ fontSize: '13.5px', color: '#A89A86' /* TOKEN-DRIFT */ }}>About Us</span>
              <span style={{ fontSize: '13.5px', color: '#A89A86' /* TOKEN-DRIFT */ }}>Journal</span>
              <span style={{ fontSize: '13.5px', color: '#A89A86' /* TOKEN-DRIFT */ }}>Careers</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#EDE2D2' /* TOKEN-DRIFT */, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Support</span>
              <span style={{ fontSize: '13.5px', color: '#A89A86' /* TOKEN-DRIFT */ }}>Help Center</span>
              <span style={{ fontSize: '13.5px', color: '#A89A86' /* TOKEN-DRIFT */ }}>Shipping</span>
              <span style={{ fontSize: '13.5px', color: '#A89A86' /* TOKEN-DRIFT */ }}>Contact</span>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1240px', margin: '48px auto 0', paddingTop: '24px', borderTop: '1px solid #3A3128' /* TOKEN-DRIFT */, fontSize: '12.5px', color: '#8A7D6C' /* TOKEN-DRIFT */ }}>
          © 2026 Hunarkar. All rights reserved.
        </div>
      </footer>

      {/* =====================================================
           CART DRAWER
         ===================================================== */}
      {cartOpen && <div id="cart-overlay" onClick={() => setCartOpen(false)} />}
      <div
        id="cart-drawer"
        style={{ transform: cartOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="cart-header">
          <h3>Your Bag ({cartCount})</h3>
          <button className="close-btn" onClick={() => setCartOpen(false)}>
            Close <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <p className="cart-empty-message">Your bag is empty.</p>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id} id={`cart-item-${item.id}`}>
                <SafeImg
                  className="cart-item-img"
                  src={item.img}
                  fallback={`https://picsum.photos/seed/${item.id}/160/200`}
                  alt={item.name}
                />
                <div className="cart-item-details">
                  <div>
                    <h4 className="cart-item-title">{item.name}</h4>
                    <div className="cart-item-price">{formatPrice(item.usdPrice, item.pkrPrice)}</div>
                    <div className="cart-qty-controls">
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-subtotal">
            <span className="cart-subtotal-label">Estimated Subtotal</span>
            <span className="cart-subtotal-val">{getSubtotal()}</span>
          </div>
          <button
            className="btn-gold"
            id="checkout-btn"
            style={{ width: '100%' }}
            onClick={() => toast.info('Secure checkout is not live yet — your bag is saved.')}
          >
            Checkout Bag
          </button>
        </div>
      </div>

      {/* =====================================================
           SEARCH OVERLAY
         ===================================================== */}
      <div id="search-overlay" className={searchOpen ? 'open' : ''}>
        <button id="search-close-btn" className="search-close" onClick={() => setSearchOpen(false)}>
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="search-input-wrap">
          <i className="fa-solid fa-magnifying-glass search-icon" />
          <input
            id="search-input"
            type="text"
            placeholder="Search the heritage catalogue..."
            className="search-input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // There is no search route yet, so this cannot actually search.
                // Saying so is better than a toast that pretends it did.
                if (!searchTerm.trim()) return;
                toast.info(`Search is not wired up yet — nothing to show for “${searchTerm}”.`);
                setSearchOpen(false);
              }
            }}
            autoFocus={searchOpen}
          />
        </div>
        <div className="search-suggestions">
          {['Cobalt Vase', 'Walnut Box', 'Ajrak Scarf', 'Khussa Shoes', 'Brass Tray'].map(s => (
            <span
              key={s}
              className="suggestion-tag"
              onClick={() => {
                setSearchTerm(s);
                toast.info(`Search is not wired up yet — nothing to show for “${s}”.`);
                setSearchOpen(false);
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* =====================================================
           PRODUCT QUICK VIEW MODAL
         ===================================================== */}
      {quickView && (
        <div
          id="product-modal-overlay"
          onClick={() => setQuickView(null)}
        >
          <div className="product-modal" onClick={(e) => e.stopPropagation()} id="product-quick-view">
            <button className="pm-close" onClick={() => setQuickView(null)} aria-label="Close">
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="pm-image-side">
              <SafeImg
                src={quickView.img}
                fallback={`https://picsum.photos/seed/${quickView.id}-modal/700/900`}
                alt={quickView.name}
              />
            </div>
            <div className="pm-details-side">
              <div>
                <span className="product-cat">{quickView.category}</span>
                <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', marginTop: '0.6rem' }}>
                  {quickView.name}
                </h2>
                <div className="product-price" style={{ fontSize: '1.1rem', color: 'var(--gold)', marginTop: '0.8rem' }}>
                  {formatPrice(quickView.usdPrice, quickView.pkrPrice)}
                </div>
                <div className="pm-cert-badge">
                  <i className="fa-solid fa-stamp" /> Certified Authentic Heritage Craft
                </div>
                <p className="pm-description">{quickView.description}</p>
                <div className="pm-artisan-card">
                  <span className="pm-artisan-label">Artisan Signature</span>
                  <p className="pm-artisan-text">"{quickView.artisan}"</p>
                </div>
              </div>
              <button
                className="btn-gold"
                id="pm-add-to-cart-btn"
                style={{ width: '100%', marginTop: '2.5rem' }}
                onClick={() => {
                  addToCart(quickView);
                  setQuickView(null);
                }}
              >
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
           BESPOKE COMMISSION MODAL
         ===================================================== */}
      {bespokeOpen && (
        <div id="modal-overlay" onClick={closeBespoke}>
          <div id="bespoke-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bespoke Commission</h3>
              <button className="close-btn" id="bespoke-close-btn" onClick={closeBespoke}>
                Close <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="modal-body">
              <form id="bespoke-form" onSubmit={handleBespokeSubmit}>
                {/* Step 1 */}
                {bespokeStep === 1 && (
                  <div className="form-step active">
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)', marginBottom: '1.8rem' }}>
                      Select Craft Profile
                    </h4>
                    <div className="form-group">
                      <label htmlFor="craftType">Heritage Artform</label>
                      <select
                        id="craftType"
                        className="form-select"
                        value={craftType}
                        onChange={(e) => setCraftType(e.target.value)}
                      >
                        <option>Blue Pottery (Multani Floral Clay)</option>
                        <option>Indigo Ajrak Block Printing</option>
                        <option>Ralli Applique Stitch Quilt</option>
                        <option>Chiniot Walnut Woodcarving</option>
                        <option>Hammered Fine Brassware</option>
                        <option>Green/Gold Onyx Masonry</option>
                        {/* Kept in step with the same list in SiteShell. */}
                        <option>Leather Weaving & Saddlery</option>
                        <option>Palm, Rattan & Cane</option>
                        <option>Zardozi Khussa</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="dimensions">Dimensions / Space Context</label>
                      <textarea
                        id="dimensions"
                        rows={3}
                        className="form-textarea"
                        placeholder="e.g. 24×36 inch table top, custom oversized clay urn for living room..."
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
                {/* Step 2 */}
                {bespokeStep === 2 && (
                  <div className="form-step active">
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)', marginBottom: '1.8rem' }}>
                      Your Contact Info
                    </h4>
                    <div className="form-group">
                      <label htmlFor="userName">Full Name</label>
                      <input id="userName" type="text" className="form-input" placeholder="Your Name"
                        value={userName} onChange={(e) => setUserName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="userEmail">Email Address</label>
                      <input id="userEmail" type="email" className="form-input" placeholder="your@email.com"
                        value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="userWA">WhatsApp Number</label>
                      <input id="userWA" type="text" className="form-input" placeholder="+92 300 1234567"
                        value={userWA} onChange={(e) => setUserWA(e.target.value)} required />
                    </div>
                  </div>
                )}
                <div className="form-navigation">
                  {bespokeStep > 1 ? (
                    <button type="button" className="btn-outline" id="bespoke-back-btn" onClick={() => setBespokeStep(1)}>
                      ← Back
                    </button>
                  ) : <div />}
                  {bespokeStep < 2 ? (
                    <button
                      type="button"
                      id="bespoke-next-btn"
                      className="btn-gold"
                      onClick={() => dimensions.trim() ? setBespokeStep(2) : toast.error('Please describe your project before continuing.')}
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button type="submit" id="bespoke-submit-btn" className="btn-gold">
                      <i className="fa-brands fa-whatsapp" /> Submit via WhatsApp
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
