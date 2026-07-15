'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { LOCAL_PRODUCTS } from '@/lib/localProducts';
import type { ProductItem } from '@/lib/siteData';
import { useCart } from '@/lib/CartContext';
import { artisanSlugFor } from '@/lib/artisans';

interface ShopPageProps {
  initialProducts: ProductItem[];
  localProducts?: ProductItem[];
  categoryType?: 'living' | 'dining';
  title?: string;
  breadcrumbLabel?: string;
  subcategories?: Array<{ label: string; img: string; filter: string | null }>;
  materials?: string[];
}

/* ============================================================
   NAV DATA
   ============================================================ */
const DEFAULT_NAV_ITEMS = [
  { name: 'Estates' },
  { name: 'Living', active: true },
  { name: 'Dining' },
  { name: 'Bed' },
  { name: 'Bath' },
  { name: 'Outdoor' },
  { name: 'Lighting' },
  { name: 'Textiles' },
  { name: 'Rugs' },
  { name: 'Décor' },
  { name: 'Baby & Child' },
  { name: 'Teen' },
  { name: 'Sale', extraClass: 'nav-sale' },
];

const DEFAULT_SUBCATEGORIES = [
  { label: 'All Furniture', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', filter: null },
  { label: 'Benches', img: '/Woven Leather Bench/a1.png', filter: 'Bench' },
  { label: 'Chairs', img: '/Upholstered Wooden Slipper Chair/v1.png', filter: 'Chair' },
  { label: 'Stools', img: '/Solid Teak Wood Stool/k1.png', filter: 'Stool' },
  { label: 'Lounge', img: '/chaise lounge/g1.png', filter: 'Lounge' },
  { label: 'Sofas & Poufs', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', filter: 'Sofa' },
  { label: 'Storage', img: '/Live Edge Shoe Rack/image.png', filter: 'Storage' },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'az', label: 'Alphabetically, A–Z' },
  { value: 'za', label: 'Alphabetically, Z–A' },
];

const DEFAULT_MATERIALS = ['Walnut Wood', 'Teak', 'Rattan', 'Leather', 'Kilim', 'Jute', 'Palm Leaf', 'Cotton'];
const PRICE_RANGES = [
  { label: 'Under $150', min: 0, max: 150 },
  { label: '$150 – $250', min: 150, max: 250 },
  { label: '$250 – $400', min: 250, max: 400 },
  { label: '$400+', min: 400, max: Infinity },
];

type PriceRange = (typeof PRICE_RANGES)[number];

/* ============================================================
   HELPERS
   ============================================================ */
function getMaterial(name: string): string[] {
  const n = name.toLowerCase();
  const found: string[] = [];
  if (n.includes('walnut')) found.push('Walnut');
  if (n.includes('teak')) found.push('Teak');
  if (n.includes('rattan')) found.push('Rattan');
  if (n.includes('leather')) found.push('Leather');
  if (n.includes('kilim')) found.push('Kilim');
  if (n.includes('jute')) found.push('Jute');
  if (n.includes('palm')) found.push('Palm');
  if (n.includes('cotton')) found.push('Cotton');
  if (n.includes('woven') && found.length === 0) found.push('Woven');
  return found.length ? found : ['Handcrafted'];
}

function getBadge(product: ProductItem, idx: number): string | null {
  if (idx < 4) return 'New Arrival';
  if (product.category === 'Lounge') return 'Made to Order';
  if (product.usdPrice >= 300) return 'Heritage Piece';
  return null;
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function ShopPage({
  initialProducts,
  localProducts = LOCAL_PRODUCTS,
  categoryType = 'living',
  title = 'All Living Room',
  breadcrumbLabel = 'Living',
  subcategories = DEFAULT_SUBCATEGORIES,
  materials = DEFAULT_MATERIALS,
}: ShopPageProps) {
  const navItems = useMemo(() => {
    return [
      { name: 'Estates', href: '/' },
      { name: 'Living', active: categoryType === 'living', href: '/shop/living' },
      { name: 'Dining', active: categoryType === 'dining', href: '/dining' },
      { name: 'Bed', href: '/bed' },
      { name: 'Bath', href: '/' },
      { name: 'Outdoor', href: '/' },
      { name: 'Lighting', href: '/lighting' },
      { name: 'Textiles', href: '/textiles' },
      { name: 'Rugs', href: '/' },
      { name: 'Décor', href: '/' },
      { name: 'Baby & Child', href: '/' },
      { name: 'Teen', href: '/' },
      { name: 'Sale', href: '/', extraClass: 'nav-sale' },
    ];
  }, [categoryType]);
  /* ---- Header state ---- */
  const [scrolled, setScrolled] = useState(true); // always solid on shop page
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  /* Cart is shared site-wide and persisted — see lib/CartContext. */
  const {
    cart, addToCart, removeFromCart, cartCount,
    cartOpen, setCartOpen, formatPrice, getSubtotal,
  } = useCart();

  /* ---- Shop state ---- */
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeMaterials, setActiveMaterials] = useState<string[]>([]);
  const [activePriceRange, setActivePriceRange] = useState<PriceRange | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'collections' | 'inspiration'>('products');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  /* ---- Subcategory scroller (snap + arrows + drag) ---- */
  const subcatRef = useRef<HTMLDivElement>(null);
  const [subcatNav, setSubcatNav] = useState({ left: false, right: false });
  const dragState = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  const updateSubcatNav = useCallback(() => {
    const el = subcatRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setSubcatNav({ left: el.scrollLeft > 4, right: el.scrollLeft < max - 4 });
  }, []);

  useEffect(() => {
    updateSubcatNav();
    window.addEventListener('resize', updateSubcatNav);
    return () => window.removeEventListener('resize', updateSubcatNav);
  }, [updateSubcatNav]);

  const scrollSubcat = (dir: number) => {
    const el = subcatRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const onSubcatDown = (e: React.PointerEvent) => {
    const el = subcatRef.current;
    if (!el) return;
    dragState.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
  };
  const onSubcatMove = (e: React.PointerEvent) => {
    const el = subcatRef.current;
    const d = dragState.current;
    if (!el || !d.down) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
    }
    el.scrollLeft = d.startScroll - dx;
  };
  const onSubcatUp = () => { dragState.current.down = false; };

  /* ---- Custom sort dropdown ---- */
  const sortRef = useRef<HTMLDivElement>(null);
  const [sortOpen, setSortOpen] = useState(false);
  useEffect(() => {
    if (!sortOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSortOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [sortOpen]);
  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Featured';

  /* ---- Combined products ---- */
  const allProducts = useMemo(() => {
    const combined = [...initialProducts];
    localProducts.forEach(lp => {
      if (!combined.some(p => p.name.toLowerCase() === lp.name.toLowerCase())) {
        combined.push(lp);
      }
    });
    return combined;
  }, [initialProducts, localProducts]);

  /* ---- Filtered + sorted ---- */
  const displayProducts = useMemo(() => {
    let list = [...allProducts];

    // Subcategory filter
    if (activeSubcat) {
      list = list.filter(p => {
        if (p.category === activeSubcat) return true;
        // Map overlapping or legacy categories
        if (activeSubcat === 'Dinnerware' && p.category === 'Blue Pottery') return true;
        if (activeSubcat === 'Dining Table' && p.category === 'Table') return true;
        if (activeSubcat === 'Dining Chair' && p.category === 'Chair') return true;
        return false;
      });
    }

    // Material filter
    if (activeMaterials.length > 0) {
      list = list.filter(p => {
        const mats = getMaterial(p.name);
        return activeMaterials.some(m => mats.some(pm => pm.toLowerCase().includes(m.toLowerCase().split(' ')[0])));
      });
    }

    // Price filter
    if (activePriceRange) {
      list = list.filter(p => p.usdPrice >= activePriceRange.min && p.usdPrice <= activePriceRange.max);
    }

    // Sort
    if (sortBy === 'price-asc') list.sort((a, b) => a.usdPrice - b.usdPrice);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.usdPrice - a.usdPrice);
    else if (sortBy === 'newest') list.reverse();
    else if (sortBy === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'za') list.sort((a, b) => b.name.localeCompare(a.name));

    return list;
  }, [allProducts, activeSubcat, activeMaterials, activePriceRange, sortBy]);

  /* ---- Scroll: header always solid on shop page ---- */
  useEffect(() => {
    setScrolled(true);
  }, []);

  /* ---- Wishlist toggle ---- */
  const toggleWishlist = useCallback((id: string) => {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  /* ---- Clear filters ---- */
  const clearFilters = () => {
    setActiveSubcat(null);
    setActiveMaterials([]);
    setActivePriceRange(null);
  };

  const hasFilters = activeSubcat || activeMaterials.length > 0 || activePriceRange;

  /* ---- Material toggle ---- */
  const toggleMaterial = (mat: string) => {
    setActiveMaterials(prev =>
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  /* ---- Accordion sections (PB-style inline filter sidebar) ---- */
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true, material: true, price: true,
  });
  const toggleSection = (id: string) =>
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  /* ---- Filter counts (from all products, unfiltered) ---- */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, [allProducts]);

  const materialCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach(p => {
      getMaterial(p.name).forEach(m => { counts[m] = (counts[m] || 0) + 1; });
    });
    return counts;
  }, [allProducts]);

  const priceCounts = useMemo(() => {
    return PRICE_RANGES.map(range => ({
      ...range,
      count: allProducts.filter(p => p.usdPrice >= range.min && p.usdPrice <= range.max).length,
    }));
  }, [allProducts]);

  return (
    <>
      {/* =====================================================
           HEADER — PB-style 5-row
         ===================================================== */}
      <header id="shop-pb-header">

        {/* Row 1 — Scrolling media ticker */}
        <div className="shop-ticker-bar">
          <div className="shop-ticker-track">
            {[
              'New Collection: Woven Leather Benches — Crafted in Lahore',
              'Free Shipping on orders over $150',
              'Heritage Pottery Now Available — Limited Edition Multan Blue',
              'Bespoke Commissions Open — 6–8 Week Lead Time',
              'Meet Our Artisans: Ustad Shamil Raza, 4th-Generation Potter',
              'New Arrivals: Hand-Blocked Ajrak Textiles from Sindh',
              '400+ Years of Craft — Proudly Pakistani, Globally Shipped',
              'Gift Registry Now Available — Curate Your Dream Home',
              'New Collection: Woven Leather Benches — Crafted in Lahore',
              'Free Shipping on orders over $150',
              'Heritage Pottery Now Available — Limited Edition Multan Blue',
              'Bespoke Commissions Open — 6–8 Week Lead Time',
              'Meet Our Artisans: Ustad Shamil Raza, 4th-Generation Potter',
              'New Arrivals: Hand-Blocked Ajrak Textiles from Sindh',
              '400+ Years of Craft — Proudly Pakistani, Globally Shipped',
              'Gift Registry Now Available — Curate Your Dream Home',
            ].map((item, i) => (
              <span key={i} className="shop-ticker-item">
                <span className="shop-ticker-dot">✦</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 — Search · Logo · Actions */}
        <div className="pb-main-row">
          {/* Left: Search box */}
          <div className="pb-search-wrap">
            <button
              className="pb-ham-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span className={`hamburger-icon${mobileMenuOpen ? ' open' : ''}`}><span /><span /><span /></span>
            </button>
            <div className="pb-search-box">
              <button className="pb-search-btn" aria-label="Search">
                <i className="fa-solid fa-magnifying-glass" />
              </button>
              <input
                type="text"
                placeholder="Search handcrafted pieces…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pb-search-input"
              />
              {searchTerm && (
                <button
                  className="pb-search-clear"
                  aria-label="Clear search"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>
          </div>

          {/* Center: Logo */}
          <a href="/" className="pb-logo">H<em>unarkar</em></a>

          {/* Right: Labeled icon actions */}
          <div className="pb-actions">
            <button className="pb-action-btn" aria-label="Account">
              <i className="fa-regular fa-user" />
              <span>Account</span>
            </button>
            <button className="pb-action-btn" aria-label="Track Order">
              <i className="fa-solid fa-box" />
              <span>Track Order</span>
            </button>
            <button className="pb-action-btn" aria-label="Favourites">
              <i className="fa-regular fa-heart" />
              <span>Favourites</span>
            </button>
            <button
              className="pb-action-btn"
              onClick={() => setCartOpen(true)}
              aria-label="Bag"
            >
              <i className="fa-solid fa-bag-shopping" />
              <span>Bag ({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Row 3 — Main category nav */}
        <nav className="pb-cat-nav" aria-label="Main navigation">
          {navItems.map(({ name, active, extraClass, href }) => (
            <a
              key={name}
              href={active ? '#' : href}
              className={`pb-cat-link${extraClass ? ` ${extraClass}` : ''}${active ? ' pb-cat-active' : ''}`}
            >
              {name}
            </a>
          ))}
        </nav>

      </header>

      {/* =====================================================
           HAMBURGER MENU
         ===================================================== */}
      {mobileMenuOpen && (
        <div className="ham-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className={`ham-dropdown${mobileMenuOpen ? ' open' : ''}`} data-lenis-prevent>
        <div className="ham-inner">
          {[
            { heading: 'Products', img: 'https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600&auto=format&fit=crop&q=80', links: ['Blue Pottery', 'Ajrak Textiles', 'Woodcarving', 'Khussa Footwear', 'Brass & Onyx', 'Ralli Quilts'] },
            { heading: 'Artisans', img: 'https://images.unsplash.com/photo-1590605095243-072811dbe64c?w=600&auto=format&fit=crop&q=80', links: ['Sindhi Block Printers', 'Lahori Woodcarvers', 'Multani Potters', 'Punjab Phulkari Makers', 'Balochi Weavers', 'Kashmiri Embroiderers'] },
            { heading: 'Services', img: '/service.png', links: ['Bespoke Commissions', 'Interior Styling', 'Corporate Gifting', 'Heritage Sourcing', 'White-Glove Delivery'] },
            { heading: 'Heritage', img: 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&auto=format&fit=crop&q=80', links: ['400 Years of Craft', 'Artisan Stories', 'The Hunarkar Journal', 'Provenance & Process', 'About Us'] },
          ].map(col => (
            <div key={col.heading} className="ham-col">
              <div className="ham-col-img-wrap"><img src={col.img} alt={col.heading} /></div>
              <div className="ham-col-eyebrow">Our</div>
              <div className="ham-col-heading">{col.heading}</div>
              <ul className="ham-col-links">
                {col.links.map(l => (
                  <li key={l}><a href="/" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="ham-footer-bar">
          {['Customer Experience', 'Sign up for Emails', 'Heritage Journal', 'WhatsApp Us', 'Privacy Notice', 'Careers'].map(l => (
            <a key={l} href="#" className="ham-footer-link">{l}</a>
          ))}
        </div>
      </div>

      {/* =====================================================
           SEARCH OVERLAY
         ===================================================== */}
      {searchOpen && (
        <div className="search-overlay active" onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
          <div className="search-box">
            <input
              autoFocus
              type="text"
              placeholder="Search Hunarkar…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-close-btn" onClick={() => setSearchOpen(false)}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
           CART SIDEBAR
         ===================================================== */}
      {cartOpen && <div className="cart-backdrop active" onClick={() => setCartOpen(false)} />}
      <aside className={`cart-sidebar${cartOpen ? ' open' : ''}`} data-lenis-prevent>
        <div className="cart-header">
          <span className="cart-title">Your Bag ({cartCount})</span>
          <button className="cart-close" onClick={() => setCartOpen(false)}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="cart-items-wrap">
          {cart.length === 0 ? (
            <div className="cart-empty">Your bag is empty.</div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.img} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">
                    {formatPrice(item.usdPrice * item.quantity, item.pkrPrice * item.quantity)}
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>{getSubtotal()}</span>
            </div>
            <button className="shop-checkout-btn">Proceed to Checkout</button>
          </div>
        )}
      </aside>

      {/* =====================================================
           MAIN SHOP CONTENT
         ===================================================== */}
      <main className="shop-main">

        {/* Breadcrumb */}
        <div className="shop-breadcrumb">
          <a href="/" className="shop-breadcrumb-link">
            <i className="fa-solid fa-chevron-left" style={{ fontSize: '0.6rem' }} />
            &nbsp;{breadcrumbLabel}
          </a>
        </div>

        {/* Category title row */}
        <div className="shop-title-row">
          <div className="shop-title-left">
            <h1 className="shop-title">{title}</h1>
            <button
              className="shop-view-items"
              onClick={() => document.querySelector('.shop-grid')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View {displayProducts.length} Items &nbsp;↓
            </button>
          </div>
          <div className="shop-title-tabs">
            {(['products', 'collections', 'inspiration'] as const).map(tab => (
              <button
                key={tab}
                className={`shop-tab-pill${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory horizontal scroll — snap + arrows + drag */}
        <div className={`shop-subcat-wrap${subcatNav.left ? ' fade-left' : ''}${subcatNav.right ? ' fade-right' : ''}`}>
          <button
            className={`shop-subcat-arrow left${subcatNav.left ? ' show' : ''}`}
            onClick={() => scrollSubcat(-1)}
            aria-label="Scroll categories left"
            tabIndex={subcatNav.left ? 0 : -1}
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          <div
            className="shop-subcat-scroll"
            ref={subcatRef}
            onScroll={updateSubcatNav}
            onPointerDown={onSubcatDown}
            onPointerMove={onSubcatMove}
            onPointerUp={onSubcatUp}
            onPointerLeave={onSubcatUp}
          >
            {subcategories.map(sub => (
              <button
                key={sub.label}
                className={`shop-subcat-item${activeSubcat === sub.filter ? ' active' : ''}`}
                onClick={() => {
                  if (dragState.current.moved) { dragState.current.moved = false; return; }
                  setActiveSubcat(prev => prev === sub.filter ? null : sub.filter);
                }}
              >
                <div className="shop-subcat-img-wrap">
                  <img src={sub.img} alt={sub.label} draggable={false} />
                </div>
                <span className="shop-subcat-label">{sub.label}</span>
              </button>
            ))}
          </div>

          <button
            className={`shop-subcat-arrow right${subcatNav.right ? ' show' : ''}`}
            onClick={() => scrollSubcat(1)}
            aria-label="Scroll categories right"
            tabIndex={subcatNav.right ? 0 : -1}
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>

        {/* Divider */}
        <div className="shop-divider" />

        {/* Filter / Sort sticky bar */}
        <div className="shop-filterbar">
          <button className="shop-filter-btn" onClick={() => setFilterOpen(f => !f)}>
            <i className="fa-solid fa-sliders" style={{ marginRight: '0.5rem' }} />
            {filterOpen ? 'Hide Filter' : 'Filter'}
          </button>

          <div className="shop-filterbar-right">
            {hasFilters && (
              <button className="shop-clear-link" onClick={clearFilters}>Clear All</button>
            )}
            <div className="shop-sort-wrap" ref={sortRef}>
              <button
                type="button"
                className={`shop-sort-trigger${sortOpen ? ' open' : ''}`}
                onClick={() => setSortOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                <span className="shop-sort-trigger-label">
                  Sort: <strong>{currentSortLabel}</strong>
                </span>
                <i className="fa-solid fa-chevron-down shop-sort-caret" />
              </button>
              {sortOpen && (
                <ul className="shop-sort-menu" role="listbox">
                  {SORT_OPTIONS.map(o => (
                    <li
                      key={o.value}
                      role="option"
                      aria-selected={sortBy === o.value}
                      className={`shop-sort-option${sortBy === o.value ? ' active' : ''}`}
                      onClick={() => { setSortBy(o.value); setSortOpen(false); }}
                    >
                      <span>{o.label}</span>
                      {sortBy === o.value && <i className="fa-solid fa-check" />}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="shop-active-filters">
            {activeSubcat && (
              <span className="shop-chip">
                {activeSubcat}s
                <button onClick={() => setActiveSubcat(null)}><i className="fa-solid fa-xmark" /></button>
              </span>
            )}
            {activeMaterials.map(m => (
              <span key={m} className="shop-chip">
                {m}
                <button onClick={() => toggleMaterial(m)}><i className="fa-solid fa-xmark" /></button>
              </span>
            ))}
            {activePriceRange && (
              <span className="shop-chip">
                {activePriceRange.label}
                <button onClick={() => setActivePriceRange(null)}><i className="fa-solid fa-xmark" /></button>
              </span>
            )}
          </div>
        )}

        {/* =====================================================
             CONTENT AREA — inline filter sidebar + grid (PB-style)
           ===================================================== */}
        <div className="shop-content-area">

        {filterOpen && (
          <aside className="shop-filter-sidebar">
            {/* Category */}
            <div className="shop-filter-section">
              <button className="shop-filter-accordion-btn" onClick={() => toggleSection('category')}>
                <span>Category</span>
                <i className={`fa-solid fa-chevron-${openSections.category ? 'up' : 'down'}`} />
              </button>
              {openSections.category && (
                <div className="shop-filter-section-body">
                  {subcategories.filter(s => s.filter !== null).map(sub => {
                    const cat = sub.filter!;
                    return (
                      <label key={cat} className="shop-filter-check">
                        <input
                          type="checkbox"
                          checked={activeSubcat === cat}
                          onChange={() => setActiveSubcat(prev => prev === cat ? null : cat)}
                        />
                        <span>{sub.label}</span>
                        <span className="shop-filter-count">({categoryCounts[cat] || 0})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Material */}
            <div className="shop-filter-section">
              <button className="shop-filter-accordion-btn" onClick={() => toggleSection('material')}>
                <span>Material</span>
                <i className={`fa-solid fa-chevron-${openSections.material ? 'up' : 'down'}`} />
              </button>
              {openSections.material && (
                <div className="shop-filter-section-body">
                  {materials.map(mat => (
                    <label key={mat} className="shop-filter-check">
                      <input
                        type="checkbox"
                        checked={activeMaterials.includes(mat)}
                        onChange={() => toggleMaterial(mat)}
                      />
                      <span>{mat}</span>
                      <span className="shop-filter-count">({materialCounts[mat.split(' ')[0]] || 0})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="shop-filter-section">
              <button className="shop-filter-accordion-btn" onClick={() => toggleSection('price')}>
                <span>Price</span>
                <i className={`fa-solid fa-chevron-${openSections.price ? 'up' : 'down'}`} />
              </button>
              {openSections.price && (
                <div className="shop-filter-section-body">
                  {priceCounts.map(range => (
                    <label key={range.label} className="shop-filter-check">
                      <input
                        type="checkbox"
                        checked={activePriceRange?.label === range.label}
                        onChange={() => setActivePriceRange(prev =>
                          prev?.label === range.label
                            ? null
                            : { label: range.label, min: range.min, max: range.max }
                        )}
                      />
                      <span>{range.label}</span>
                      <span className="shop-filter-count">({range.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {hasFilters && (
              <button className="shop-filter-clear" onClick={clearFilters}>Clear All Filters</button>
            )}
          </aside>
        )}

        {/* Product Grid */}
        <div className={`shop-grid-wrap${filterOpen ? ' sidebar-open' : ''}`}>
        <div className="shop-grid">
          {displayProducts.length === 0 ? (
            <div className="shop-empty">No products match your filters.</div>
          ) : (
            displayProducts.map((product, idx) => {
              const materials = getMaterial(product.name);
              const badge = getBadge(product, idx);
              const isWished = wishlist.has(product.id);
              const isHovered = hoveredId === product.id;

              return (
                <div
                  key={product.id}
                  className="shop-card"
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Image */}
                  <div className="shop-card-img-wrap">
                    <a href={`/shop/product/${product.id}`} className="shop-card-img-link" aria-label={product.name}>
                      <img
                        src={product.img}
                        alt={product.name}
                        className="shop-card-img"
                        onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id}/600/500`; }}
                      />
                    </a>

                    {/* Badge */}
                    {badge && (
                      <span className="shop-card-badge">{badge}</span>
                    )}

                    {/* Wishlist */}
                    <button
                      className={`shop-card-heart${isWished ? ' wished' : ''}`}
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Add to wishlist"
                    >
                      <i className={isWished ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
                    </button>

                    {/* Quick Add overlay */}
                    <div className={`shop-card-quick-add${isHovered ? ' visible' : ''}`}>
                      <button onClick={() => addToCart(product)}>Add to Bag</button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="shop-card-info">
                    {/* Material swatches */}
                    <div className="shop-card-materials">
                      {materials.map(m => (
                        <span key={m} className="shop-card-material-chip" title={m} />
                      ))}
                      {materials.length > 1 && (
                        <span className="shop-card-material-more">+ {materials.length - 1} more</span>
                      )}
                    </div>

                    {/* Meta tags */}
                    <div className="shop-card-meta">
                      <span>Handcrafted</span>
                      {product.category && <span>{product.category}</span>}
                    </div>

                    {/* Name */}
                    <a href={`/shop/product/${product.id}`} className="shop-card-name">{product.name}</a>

                    {/* Artisan — links into the maker's dossier when the
                        registry claims them, plain text otherwise. */}
                    <div className="shop-card-artisan">
                      {artisanSlugFor(product.artisan)
                        ? <a href={`/artisans/${artisanSlugFor(product.artisan)}`}>{product.artisan}</a>
                        : product.artisan}
                    </div>

                    {/* Price */}
                    <div className="shop-card-price">
                      ${product.usdPrice.toLocaleString()}
                      <span className="shop-card-price-pkr"> · ₨{product.pkrPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        </div>
        </div>

        {/* Load more */}
        {displayProducts.length > 0 && (
          <div className="shop-load-more">
            <button className="shop-load-btn">Load More</button>
            <p className="shop-load-count">Showing {displayProducts.length} of {allProducts.length} pieces</p>
          </div>
        )}

        {/* Editorial footer copy */}
        <div className="shop-seo-copy">
          <h2>Handcrafted Pakistani Living Room Furniture</h2>
          <p>
            Every piece in our living room collection is made by master artisans across Pakistan — from the woodcarvers of Chiniot to the leather craftsmen of Lahore and the kilim weavers of Sindh. Each bench, chair, and stool carries centuries of craft knowledge and is built to last a lifetime.
          </p>
        </div>

        {/* Footer */}
        <footer>
          <div className="footer-grid">
            <div>
              <div className="footer-logo">H<em>unarkar</em></div>
              <p className="footer-about-text">Where Craft Becomes Heritage — handmade Pakistani artisan furniture, textiles, and décor for the discerning home.</p>
              <div className="social-links">
                <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
                <a href="#" aria-label="Pinterest"><i className="fa-brands fa-pinterest" /></a>
                <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook" /></a>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Customer Care</div>
              <ul className="footer-links">
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">WhatsApp Support</a></li>
                <li><a href="#">Shipping & Returns</a></li>
                <li><a href="#">Care & Repair</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Company</div>
              <ul className="footer-links">
                <li><a href="#">Our Story</a></li>
                <li><a href="#">Artisan Partners</a></li>
                <li><a href="#">Fair Trade</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Explore</div>
              <ul className="footer-links">
                <li><a href="#">Heritage Journal</a></li>
                <li><a href="#">Gift Registry</a></li>
                <li><a href="#">Trade Programme</a></li>
                <li><a href="#">Design Services</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2025 Hunarkar. All rights reserved.</span>
            <span className="footer-copy"><a href="#" style={{ color: 'inherit' }}>Privacy</a> · <a href="#" style={{ color: 'inherit' }}>Terms</a></span>
          </div>
        </footer>
      </main>
    </>
  );
}
