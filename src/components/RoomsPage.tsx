'use client';

/* ============================================================
   SHOP ROOMS — /rooms  (redesigned)

   What changed and why:
   · The page now renders inside SiteShell instead of carrying its
     own degraded header copy — cart, search, mega-menu and footer
     all work here now, matching every other interior page.
   · ~300 lines of inline style objects moved to rm- classes in
     globals.css. Inline styles cannot carry media queries, which
     is why the old grid was 2 columns on phones.
   · Headings were Jost weight-100 uppercase with negative
     tracking (an off-system drift the design doc explicitly
     warns about, and weight 100 isn't even loaded). Display type
     is Cormorant again; Jost is reserved for labels.
   · The room's own name ("The Lahori Living Room") existed in
     data but was never rendered. It now sits on a linen card over
     the top-left of the scene — deliberately covering the RH
     promotional text that is baked into the room.png source file.
   · Hotspots on right-hand duplicates (sofa/mirror/ottoman) used
     to scroll nowhere: the grid de-dupes by name, so their card
     ids didn't exist. They now resolve to the surviving card.
   · Category tabs used to relabel the section while showing the
     same living room. Categories without a room now show an
     honest empty state instead.
   · "Add to Inquiry" was a dead button; it now opens the site's
     bespoke inquiry modal — the one flow that matches the label.
   · Hotspots, arrows and the toggle are real <button>s now:
     keyboard-reachable, with focus states.

   All product data, copy, and the hotspot/toggle/tab behaviours
   are otherwise unchanged.
   ============================================================ */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SiteShell, { useSiteContext } from './SiteShell';

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
   PRODUCT DATA — unchanged
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

const CATEGORIES = ['Estates', 'Living', 'Dining', 'Bedroom', 'Bath', 'Textiles', 'Lighting', 'Rugs', 'Décor', 'Outdoor'];

/* ─────────────────────────────────────────────
   PLUS HOTSPOT — now a real <button> (keyboard-
   reachable); static styles live in rm- classes,
   only the data-driven x/y position stays inline.
───────────────────────────────────────────── */
function PlusHotspot({
  product,
  visible,
  onScrollTo,
}: {
  product: RoomProduct;
  visible: boolean;
  onScrollTo: (p: RoomProduct) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={product.id}
          className="rm-hotspot-wrap"
          style={{ left: `${product.x}%`, top: `${product.y}%`, zIndex: hovered ? 50 : 38 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <motion.button
            type="button"
            className="rm-hotspot"
            aria-label={`View ${product.name}`}
            onClick={() => onScrollTo(product)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            animate={{ scale: hovered ? 1.18 : 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          >
            +
          </motion.button>

          <AnimatePresence>
            {hovered && (
              <motion.div
                className="rm-hotspot-tip"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.14 }}
              >
                {product.name}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT CARD — same content, on-system type:
   Cormorant name, legible sizes, hairline chips.
   The dead href="#" is gone (there is no PDP for
   these pieces); the hotspots target the card.
───────────────────────────────────────────── */
function RoomProductCard({ product }: { product: RoomProduct }) {
  const { openBespoke } = useSiteContext();

  return (
    <motion.article
      id={`product-${product.id}`}
      className="rm-card"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="rm-card-img">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>

      <span className="rm-card-eyebrow">
        {product.category} · {product.origin}
      </span>

      <h3 className="rm-card-name">{product.name}</h3>

      <p className="rm-card-desc">{product.description}</p>

      <p className="rm-card-material">{product.material} — {product.artisan}</p>

      <div className="rm-card-prices">
        <span className="rm-card-usd">{product.usdPrice}</span>
        <span className="rm-card-price-sep" aria-hidden="true" />
        <span className="rm-card-pkr">{product.pkrPrice}</span>
      </div>

      <div className="rm-card-tags">
        {product.tags.map(tag => (
          <span key={tag} className="rm-card-tag">{tag}</span>
        ))}
      </div>

      {/* Was a dead button; the bespoke modal IS the inquiry flow. */}
      <button type="button" className="cta-link rm-card-cta" onClick={() => openBespoke()}>
        Add to Inquiry
      </button>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────
   PAGE CONTENT
───────────────────────────────────────────── */
function RoomsContent() {
  const [activeCategory, setActiveCategory] = useState('Living');
  const [currentRoomIdx, setCurrentRoomIdx] = useState(0);
  const [showProducts, setShowProducts] = useState(true);

  /* Tabs used to relabel the section while still showing the living
     room. Rooms are filtered by category now; empty categories get
     an honest empty state. */
  const roomsForCategory = ROOMS.filter(r => r.category === activeCategory);
  const currentRoom = roomsForCategory[Math.min(currentRoomIdx, Math.max(0, roomsForCategory.length - 1))];

  const selectCategory = (cat: string) => {
    setActiveCategory(cat);
    setCurrentRoomIdx(0);
  };

  /* The grid de-dupes by name (two sofas in the room, one card), so a
     right-hand hotspot's own id has no card. Resolve to the card that
     survived de-duplication instead of silently doing nothing. */
  const scrollToProduct = useCallback((product: RoomProduct) => {
    const target = currentRoom?.products.find(q => q.name === product.name) ?? product;
    const el = document.getElementById(`product-${target.id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('rm-card-flash');
    setTimeout(() => el.classList.remove('rm-card-flash'), 1400);
  }, [currentRoom]);

  const goLeft  = () => setCurrentRoomIdx(i => Math.max(0, i - 1));
  const goRight = () => setCurrentRoomIdx(i => Math.min(roomsForCategory.length - 1, i + 1));

  const dedupedProducts = currentRoom
    ? currentRoom.products.filter((p, i, arr) => arr.findIndex(q => q.name === p.name) === i)
    : [];

  return (
    <main className="rm">
      {/* ── Masthead: same copy, Cormorant register ── */}
      <header className="rm-masthead">
        <nav className="rm-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Rooms</span>
        </nav>
        <h1 className="rm-title">Shop Rooms</h1>
      </header>

      {/* ── Category rail ── */}
      <div className="rm-tabs" role="tablist" aria-label="Room categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={cat === activeCategory}
            className={`rm-tab${cat === activeCategory ? ' active' : ''}`}
            onClick={() => selectCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {currentRoom ? (
        <>
          {/* ── The scene ── */}
          <section className="rm-scene" aria-label={currentRoom.label}>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentRoom.id}
                src="/room.png"
                alt={currentRoom.label}
                draggable={false}
                className="rm-scene-img"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              />
            </AnimatePresence>

            {/* Room label card — the label/subtitle data was never
                rendered before. Positioned top-left, where it also
                covers third-party promotional text baked into the
                source photograph. */}
            <div className="rm-scene-label">
              <span className="rm-scene-label-eyebrow">{currentRoom.subtitle}</span>
              <h2 className="rm-scene-label-title">{currentRoom.label}</h2>
              {roomsForCategory.length > 1 && (
                <span className="rm-scene-counter">
                  {currentRoomIdx + 1} / {roomsForCategory.length}
                </span>
              )}
            </div>

            {currentRoom.products.map(product => (
              <PlusHotspot
                key={product.id}
                product={product}
                visible={showProducts}
                onScrollTo={scrollToProduct}
              />
            ))}

            {/* Arrows only exist when there is somewhere to go —
                two permanently disabled panels helped nobody. */}
            {roomsForCategory.length > 1 && (
              <>
                <button
                  type="button"
                  className="rm-scene-arrow rm-scene-arrow--left"
                  onClick={goLeft}
                  disabled={currentRoomIdx === 0}
                  aria-label="Previous room"
                >
                  <i className="fa-solid fa-chevron-left" />
                </button>
                <button
                  type="button"
                  className="rm-scene-arrow rm-scene-arrow--right"
                  onClick={goRight}
                  disabled={currentRoomIdx === roomsForCategory.length - 1}
                  aria-label="Next room"
                >
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </>
            )}
          </section>

          {/* ── Utility bar ── */}
          <div className="rm-utility">
            <button
              type="button"
              className="rm-toggle"
              aria-pressed={showProducts}
              onClick={() => setShowProducts(v => !v)}
            >
              <span className={`rm-toggle-box${showProducts ? ' checked' : ''}`} aria-hidden="true">
                {showProducts && '✓'}
              </span>
              Show Products
            </button>
            <span className="rm-utility-count">
              {dedupedProducts.length} {dedupedProducts.length === 1 ? 'piece' : 'pieces'}
            </span>
          </div>

          {/* ── Items in this room ── */}
          <section className="rm-items" aria-labelledby="rm-items-h">
            <div className="rm-items-head">
              <h2 id="rm-items-h" className="rm-items-title">Items in This Room</h2>
              <div className="rm-items-rule" aria-hidden="true" />
            </div>

            <div className="rm-grid">
              {dedupedProducts.map(product => (
                <RoomProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </>
      ) : (
        /* Honest empty state — the old page showed the living room
           relabelled as whatever tab you clicked. */
        <div className="rm-empty">
          <p>The {activeCategory} room is still being photographed.</p>
          <button type="button" className="cta-link" onClick={() => selectCategory('Living')}>
            View the Living Room
          </button>
        </div>
      )}
    </main>
  );
}

export default function RoomsPage() {
  return (
    <SiteShell>
      <RoomsContent />
    </SiteShell>
  );
}
