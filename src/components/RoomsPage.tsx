'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface RoomProduct {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  usdPrice: string;
  pkrPrice: string;
  description: string;
  material: string;
  artisan: string;
  origin: string;
  image: string;
  tags: string[];
}

interface RoomScene {
  id: string;
  label: string;
  subtitle: string;
  category: string;
  products: RoomProduct[];
}

/* ─────────────────────────────────────────────
   PRODUCT DATA
───────────────────────────────────────────── */
const LIVING_PRODUCTS: RoomProduct[] = [
  { id: 'lahori-cloud-sofa-left',    name: 'Lahori Cloud Sofa',          category: 'Seating',  x: 18, y: 62, usdPrice: '$4,995', pkrPrice: '₨1,395,000', description: 'Hand-crafted in Lahore over six weeks. Sheesham wood frame with hand-woven camel-hued fabric.',               material: 'Hand-woven Fabric · Solid Sheesham Wood', artisan: 'Ustad Hamid & Sons',            origin: 'Lahore, Punjab',       image: '/hk2.png', tags: ['Handcrafted', 'Made to Order', '6-Week Lead'] },
  { id: 'lahori-cloud-sofa-right',   name: 'Lahori Cloud Sofa',          category: 'Seating',  x: 83, y: 55, usdPrice: '$4,995', pkrPrice: '₨1,395,000', description: 'Hand-crafted in Lahore over six weeks. Sheesham wood frame with hand-woven camel-hued fabric.',               material: 'Hand-woven Fabric · Solid Sheesham Wood', artisan: 'Ustad Hamid & Sons',            origin: 'Lahore, Punjab',       image: '/hk2.png', tags: ['Handcrafted', 'Made to Order'] },
  { id: 'sindhi-floor-lamp',         name: 'Sindhi Brass Floor Lamp',    category: 'Lighting', x: 13, y: 42, usdPrice: '$1,295', pkrPrice: '₨361,000',   description: 'Cast in a single pour via the lost-wax process with hand-engraved geometric motifs from Sindhi tile work.', material: 'Polished Brass · Linen Shade',             artisan: 'Hyderabad Brass Guild',         origin: 'Hyderabad, Sindh',     image: '/hk1.png', tags: ['Sindhi Craft', 'Hand-engraved', 'Lost-Wax'] },
  { id: 'brass-drum-side-table',     name: 'Lahore Brass Drum Table',    category: 'Tables',   x: 11, y: 73, usdPrice: '$795',   pkrPrice: '₨222,000',   description: 'Hand-beaten brass drum side table with repoussé motifs. The patina deepens beautifully with age.',          material: 'Hand-beaten Antique Brass',               artisan: 'Thathera Collective',           origin: 'Lahore, Punjab',       image: '/hk1.png', tags: ['Thathera Craft', 'Hand-beaten'] },
  { id: 'peshawar-arch-mirror-left', name: 'Peshawar Arch Mirror',       category: 'Mirrors',  x: 42, y: 52, usdPrice: '$1,695', pkrPrice: '₨473,000',   description: 'Tall arched floor mirror with hand-beaten brass frame featuring Gandhara-inspired geometric inlay.',          material: 'Antique Brass Frame · Bevelled Glass',    artisan: 'Peshawar Metal Arts',           origin: 'Peshawar, KPK',        image: '/hk1.png', tags: ['Gandhara Heritage', 'Hand-inlaid'] },
  { id: 'swat-carved-cabinet',       name: 'Swat Valley Carved Cabinet', category: 'Storage',  x: 55, y: 40, usdPrice: '$6,495', pkrPrice: '₨1,815,000', description: 'Carved over three months by master craftsmen in Swat Valley using sustainably harvested black walnut.',       material: 'Hand-carved Black Walnut · Iron Hardware',artisan: 'Malik Craft Workshop',          origin: 'Mingora, Swat Valley', image: '/hk1.png', tags: ['One-of-a-Kind', 'Heritage Craft', '3-Month Lead'] },
  { id: 'multan-brass-chandelier',   name: 'Multan Brass Chandelier',    category: 'Lighting', x: 63, y: 11, usdPrice: '$3,200', pkrPrice: '₨894,000',   description: 'Hand-beaten by master Thathera artisans in Multan. Each petal is individually shaped.',                   material: 'Antique Patina Brass · Hand-beaten',      artisan: 'Thathera Collective, Multan',   origin: 'Multan, Punjab',       image: '/hk1.png', tags: ['UNESCO Craft', 'Thathera', 'Hand-beaten'] },
  { id: 'onyx-coffee-table',         name: 'Onyx Slab Coffee Table',     category: 'Tables',   x: 49, y: 66, usdPrice: '$2,995', pkrPrice: '₨836,000',   description: 'Solid Pakistani Green Onyx on a hand-forged blackened iron base. Each stone carries unique veining.',        material: 'Pakistani Green Onyx · Forged Iron',      artisan: 'Balochistan Stone Works',       origin: 'Quetta, Balochistan',  image: '/hk2.png', tags: ['Natural Stone', 'One-of-a-Kind', 'Limited'] },
  { id: 'peshawar-arch-mirror-right',name: 'Peshawar Arch Mirror',       category: 'Mirrors',  x: 73, y: 52, usdPrice: '$1,695', pkrPrice: '₨473,000',   description: 'Tall arched floor mirror with hand-beaten brass frame featuring Gandhara-inspired geometric inlay.',          material: 'Antique Brass Frame · Bevelled Glass',    artisan: 'Peshawar Metal Arts',           origin: 'Peshawar, KPK',        image: '/hk1.png', tags: ['Gandhara Heritage', 'Hand-inlaid'] },
  { id: 'khussa-ottoman-left',       name: 'Khussa Leather Ottoman',     category: 'Seating',  x: 38, y: 84, usdPrice: '$895',   pkrPrice: '₨250,000',   description: 'X-frame ottoman in hand-stitched vegetable-tanned leather with brass nail-head trim applied one tack at a time.', material: 'Vegetable-tanned Leather · Solid Rosewood', artisan: 'Lahore Leather Guild',        origin: 'Lahore, Punjab',       image: '/hk2.png', tags: ['Handstitched', 'Artisan Leather'] },
  { id: 'khussa-ottoman-right',      name: 'Khussa Leather Ottoman',     category: 'Seating',  x: 57, y: 84, usdPrice: '$895',   pkrPrice: '₨250,000',   description: 'X-frame ottoman in hand-stitched vegetable-tanned leather. Brass nail-head trim individually applied.',      material: 'Vegetable-tanned Leather · Solid Rosewood', artisan: 'Lahore Leather Guild',        origin: 'Lahore, Punjab',       image: '/hk2.png', tags: ['Handstitched', 'Artisan Leather'] },
  { id: 'bukhara-kilim-rug',         name: 'Bukhara Kilim Rug',          category: 'Rugs',     x: 50, y: 80, usdPrice: '$3,495', pkrPrice: '₨976,000',   description: 'Hand-knotted over six months using natural wool dyed with vegetable pigments following centuries-old Bukhara patterns.', material: 'Pure New Wool · Natural Vegetable Dyes', artisan: 'Afghan-Pakistani Weavers Collective', origin: 'Peshawar, KPK', image: '/hk2.png', tags: ['Hand-knotted', 'Natural Dyes', '6-Month Lead'] },
];

const ROOMS: RoomScene[] = [
  { id: 'living-1', label: 'The Lahori Living Room', subtitle: 'Heritage Collection No. 1', category: 'Living', products: LIVING_PRODUCTS },
];

/* ─────────────────────────────────────────────
   CATEGORY TABS
───────────────────────────────────────────── */
const CATEGORIES = ['Estates', 'Living', 'Dining', 'Bedroom', 'Bath', 'Textiles', 'Lighting', 'Rugs', 'Décor', 'Outdoor'];

/* ─────────────────────────────────────────────
   GRID ICON
───────────────────────────────────────────── */
function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      {[0, 6, 12].map(gy =>
        [0, 6, 12].map(gx => (
          <rect key={`${gx}-${gy}`} x={gx} y={gy} width="4" height="4" fill="#8a7d72" />
        ))
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   PLUS HOTSPOT
───────────────────────────────────────────── */
function PlusHotspot({
  product,
  visible,
  onScrollTo,
}: {
  product: RoomProduct;
  visible: boolean;
  onScrollTo: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={product.id}
          style={{
            position: 'absolute',
            left: `${product.x}%`,
            top: `${product.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: hovered ? 50 : 30,
            cursor: 'pointer',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => onScrollTo(product.id)}
        >
          <motion.div
            animate={{ scale: hovered ? 1.18 : 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'rgba(241,237,232,0.88)',
              border: '1px solid rgba(200,195,190,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 8px rgba(26,21,18,0.22)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 300,
                color: '#2c2520',
                lineHeight: 1,
                marginTop: -1,
              }}
            >
              +
            </span>
          </motion.div>

          {/* Tooltip */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.14 }}
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(26,21,18,0.9)',
                  padding: '5px 10px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 60,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#f1ede8',
                  }}
                >
                  {product.name}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: '4px solid rgba(26,21,18,0.9)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
function ProductCard({ product }: { product: RoomProduct }) {
  return (
    <motion.div
      id={`product-${product.id}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <div style={{ background: '#ede8e2', overflow: 'hidden', marginBottom: 14, position: 'relative', aspectRatio: '4/3' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
        />
      </div>

      {/* Category + origin */}
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#8a7d72', marginBottom: 5 }}>
        {product.category} &nbsp;·&nbsp; {product.origin}
      </span>

      {/* Name */}
      <a
        href="#"
        style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#2c2520', textDecoration: 'none', lineHeight: 1.2, marginBottom: 6, display: 'block' }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#b8935a'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#2c2520'; }}
      >
        {product.name}
      </a>

      {/* Description */}
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#5a4f48', lineHeight: 1.65, marginBottom: 10 }}>
        {product.description}
      </p>

      {/* Prices */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: '#2c2520' }}>{product.usdPrice}</span>
        <span style={{ width: 1, height: 10, background: 'rgba(44,37,32,0.18)', display: 'inline-block' }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#8a7d72' }}>{product.pkrPrice}</span>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {product.tags.map(tag => (
          <span key={tag} style={{ fontFamily: 'var(--font-body)', fontSize: '0.54rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a7d72', border: '1px solid rgba(138,125,114,0.28)', padding: '2px 7px' }}>
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2c2520', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', textAlign: 'left', textUnderlineOffset: 3 }}>
        Add to Inquiry
      </button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   ROOMS PAGE
───────────────────────────────────────────── */
export default function RoomsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Living');
  const [currentRoomIdx, setCurrentRoomIdx] = useState(0);
  const [showProducts, setShowProducts] = useState(true);

  const currentRoom = ROOMS[currentRoomIdx];

  const scrollToProduct = useCallback((id: string) => {
    const el = document.getElementById(`product-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.style.outline = '2px solid #b8935a';
    el.style.outlineOffset = '8px';
    setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 1400);
  }, []);

  const goLeft  = () => setCurrentRoomIdx(i => Math.max(0, i - 1));
  const goRight = () => setCurrentRoomIdx(i => Math.min(ROOMS.length - 1, i + 1));

  return (
    <div style={{ background: '#f1ede8', minHeight: '100vh' }}>

      {/* ── Full RH-style 2-row header ── */}
      <header id="site-header" className="scrolled" style={{ position: 'sticky', top: 0, zIndex: 200, borderBottom: 'none' }}>

        {/* Row 1: hamburger/back · logo · right actions */}
        <div className="header-top-bar">
          {/* Left */}
          <div className="header-left">
            <button
              className="header-icon-btn menu-toggle"
              onClick={() => router.back()}
              aria-label="Back"
              style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center', alignItems: 'center' }}
            >
              <span className="hamburger-lines" />
            </button>
            <button className="header-icon-btn" aria-label="Search">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>

          {/* Center Logo */}
          <div className="header-logo-wrap">
            <a href="/" className="logo">
              H<em>unarkar</em>
            </a>
          </div>

          {/* Right */}
          <div className="header-right">
            <button className="header-interior-design">
              Interior Design
            </button>
            <button className="header-icon-btn" aria-label="Account">
              <i className="fa-regular fa-user" />
            </button>
            <button className="header-icon-btn" aria-label="Bag">
              <i className="fa-solid fa-bag-shopping" />
            </button>
          </div>
        </div>

        {/* Row 2: category nav */}
        <nav className="header-nav-bar" aria-label="Main navigation" style={{ borderBottom: 'none' }}>
          <a href="/#new-arrivals" className="nav-category-link">Estates</a>
          <a href="/#new-arrivals" className="nav-category-link">Living</a>
          <a href="/#new-arrivals" className="nav-category-link">Dining</a>
          <a href="/#new-arrivals" className="nav-category-link">Bed</a>
          <a href="/#new-arrivals" className="nav-category-link">Bath</a>
          <a href="/#new-arrivals" className="nav-category-link">Outdoor</a>
          <a href="/#new-arrivals" className="nav-category-link">Lighting</a>
          <a href="/#new-arrivals" className="nav-category-link">Textiles</a>
          <a href="/#new-arrivals" className="nav-category-link">Rugs</a>
          <a href="/#new-arrivals" className="nav-category-link">Décor</a>
          <a href="/#new-arrivals" className="nav-category-link nav-baby-child">Baby &amp; Child</a>
          <a href="/#new-arrivals" className="nav-category-link nav-baby-child">Teen</a>
          <a href="/#bespoke-banner" className="nav-category-link nav-sale">Sale</a>
        </nav>
      </header>

      {/* ── SHOP ROOMS heading ── */}
      <div style={{ textAlign: 'center', padding: '18px 0 14px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
            fontWeight: 100,
            color: '#2c2520',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Shop Rooms
        </h1>
      </div>

      {/* ── Hairline divider ── */}
      <div style={{ height: 1, background: 'rgba(44,37,32,0.1)', margin: '0 0 0' }} />

      {/* ── Category filter tabs ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(44,37,32,0.08)',
          padding: '0 4%',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: cat === activeCategory ? '#2c2520' : '#a09690',
              fontWeight: cat === activeCategory ? 600 : 400,
              background: 'none',
              border: 'none',
              borderBottom: cat === activeCategory ? '2px solid #2c2520' : '2px solid transparent',
              padding: '14px 16px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              marginBottom: -1,
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ── Section label + counter + grid icon ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 4%',
          borderBottom: '1px solid rgba(44,37,32,0.07)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '1.7rem', letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#b8935a', fontWeight: 100 }}>
          {activeCategory}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#b8935a', letterSpacing: '0.06em' }}>
            {currentRoomIdx + 1} / {ROOMS.length}
          </span>
          <GridIcon />
        </div>
      </div>

      {/* ── Room image + navigation arrows + hotspots ── */}
      <div style={{ position: 'relative', lineHeight: 0 }}>

        {/* Room image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentRoom.id}
            src="/room.png"
            alt={currentRoom.label}
            draggable={false}
            style={{ width: '100%', display: 'block', userSelect: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        </AnimatePresence>

        {/* + Hotspot buttons */}
        {currentRoom.products.map(product => (
          <PlusHotspot
            key={product.id}
            product={product}
            visible={showProducts}
            onScrollTo={scrollToProduct}
          />
        ))}

        {/* ← Left navigation panel */}
        <div
          onClick={goLeft}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 72,
            height: 112,
            background: '#ffffff',
            boxShadow: '2px 0 12px rgba(26,21,18,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentRoomIdx > 0 ? 'pointer' : 'default',
            opacity: currentRoomIdx > 0 ? 1 : 0.28,
            zIndex: 40,
            transition: 'opacity 0.2s',
          }}
        >
          <svg width="22" height="38" viewBox="0 0 20 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L2 17L16 32" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* › Right navigation panel */}
        <div
          onClick={goRight}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 72,
            height: 112,
            background: '#ffffff',
            boxShadow: '-2px 0 12px rgba(26,21,18,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentRoomIdx < ROOMS.length - 1 ? 'pointer' : 'default',
            opacity: currentRoomIdx < ROOMS.length - 1 ? 1 : 0.28,
            zIndex: 40,
            transition: 'opacity 0.2s',
          }}
        >
          <svg width="22" height="38" viewBox="0 0 20 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 2L18 17L4 32" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* ── ✓ SHOW PRODUCTS toggle ── */}
      <div style={{ padding: '16px 4%', display: 'flex', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
          {/* Checkbox */}
          <div
            onClick={() => setShowProducts(v => !v)}
            style={{
              width: 15,
              height: 15,
              border: '1px solid #2c2520',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {showProducts && (
              <span style={{ fontSize: '0.6rem', color: '#2c2520', lineHeight: 1, marginTop: -1 }}>✓</span>
            )}
          </div>
          <span
            onClick={() => setShowProducts(v => !v)}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2c2520' }}
          >
            Show Products
          </span>
        </label>
      </div>

      {/* ── ITEMS IN THIS ROOM ── */}
      <div style={{ padding: '8px 6% 80px' }}>

        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.6rem',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              fontWeight: 100,
              color: '#2c2520',
              margin: '0 0 16px',
            }}
          >
            Items in This Room
          </h2>
          <div style={{ width: 36, height: 1, background: 'rgba(44,37,32,0.18)', margin: '0 auto' }} />
        </div>

        {/* 2-column product grid — de-duped by name */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '56px 52px',
            maxWidth: 960,
            margin: '0 auto',
          }}
        >
          {currentRoom.products
            .filter((p, i, arr) => arr.findIndex(q => q.name === p.name) === i)
            .map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>

    </div>
  );
}
