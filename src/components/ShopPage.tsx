'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/* ============================================================
   TYPES
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

interface ShopPageProps {
  initialProducts: ProductItem[];
}

/* ============================================================
   LOCAL PRODUCTS — public-folder furniture images
   ============================================================ */
const LOCAL_PRODUCTS: ProductItem[] = [
  { id: 'lp-a', name: 'Woven Leather Bench', category: 'Bench', usdPrice: 189, pkrPrice: 52920, img: '/Woven Leather Bench/a1.png', description: 'Hand-woven natural leather strips over a solid teak frame. Each piece is unique.', artisan: 'Ustad Noor Ahmad, Lahore' },
  { id: 'lp-b', name: 'Chiniot Walnut Wood Bench', category: 'Bench', usdPrice: 245, pkrPrice: 68600, img: '/woodbench/b1.png', description: 'Hand-carved walnut bench from the master woodcarvers of Chiniot.', artisan: 'Khurshid Alam, Chiniot Studio' },
  { id: 'lp-c', name: 'Foldable Cotton Kilim Bench', category: 'Bench', usdPrice: 129, pkrPrice: 36120, img: '/Foldable Cotton Kilim Bench/c1.png', description: 'Foldable bench upholstered in hand-woven kilim cotton from Sindh.', artisan: 'Mai Fatima, Bhit Shah' },
  { id: 'lp-d', name: 'Palm Leaf Bench', category: 'Bench', usdPrice: 98, pkrPrice: 27440, img: '/Palm Leaf Bench/d1.png', description: 'Woven palm leaf bench, sustainably crafted by Balochi artisans.', artisan: 'Haji Sardar, Quetta Collective' },
  { id: 'lp-e', name: 'Real Walnut Wood Bench', category: 'Bench', usdPrice: 310, pkrPrice: 86800, img: '/Real Walnut Wood Bench/e1.png', description: 'Solid walnut bench with hand-chiselled joinery. No metal fasteners.', artisan: 'Master Iqbal, Rawalpindi Workshop' },
  { id: 'lp-f', name: 'Handwoven Palm Leaf Bench', category: 'Bench', usdPrice: 115, pkrPrice: 32200, img: '/handwoven Palm Leaf Bench/f1.png', description: 'Tightly woven palm leaf over a bamboo frame. Lightweight and durable.', artisan: 'Gohar Bibi, Sindh Craft Council' },
  { id: 'lp-g', name: 'Chaise Lounge', category: 'Lounge', usdPrice: 420, pkrPrice: 117600, img: '/chaise lounge/g1.png', description: 'Relaxed chaise lounge in hand-dyed cotton canvas on solid mango wood frame.', artisan: 'Aziz Furniture House, Lahore' },
  { id: 'lp-h', name: 'Natural Leather Bench', category: 'Bench', usdPrice: 220, pkrPrice: 61600, img: '/Natural Leather Bench/h1.png', description: 'Full-grain buffalo leather bench hand-stitched by master leather craftsmen.', artisan: 'Ghulam Nabi, Karachi Saddar' },
  { id: 'lp-i', name: 'Kilim Rug Bench', category: 'Bench', usdPrice: 165, pkrPrice: 46200, img: '/Kilim Rug Bench/i1.png', description: 'Vintage kilim fabric over a solid oak base. Each fabric is sourced from antique looms.', artisan: 'Amina Textiles, Multan' },
  { id: 'lp-j', name: 'Jute Kilim Bench', category: 'Bench', usdPrice: 109, pkrPrice: 30520, img: '/Jute Kilim Bench/j1.png', description: 'Eco-friendly jute kilim over reclaimed wood. Earthy tones, artisan finish.', artisan: 'Sajida Looms, Hyderabad' },
  { id: 'lp-k', name: 'Solid Teak Wood Stool', category: 'Stool', usdPrice: 88, pkrPrice: 24640, img: '/Solid Teak Wood Stool/k1.png', description: 'Single-piece solid teak stool with hand-turned legs. Oil-finished for longevity.', artisan: 'Tariq Woodworks, Gujranwala' },
  { id: 'lp-t', name: 'Brown Truffle Woven Bench', category: 'Bench', usdPrice: 175, pkrPrice: 49000, img: '/Brown Truffle Woven Bench/t1.png', description: 'Rich truffle-toned woven leather bench with mahogany base.', artisan: 'Ustad Bashir, Sialkot Leather Guild' },
  { id: 'lp-l', name: 'Handmade Kilim Bench', category: 'Bench', usdPrice: 148, pkrPrice: 41440, img: '/handmade  Kilim Bench/l1.png', description: 'Vibrant kilim patchwork on solid walnut. Each bench is a unique composition.', artisan: 'Zubeda Craft House, Lahore' },
  { id: 'lp-u', name: 'Rattan Bench', category: 'Bench', usdPrice: 135, pkrPrice: 37800, img: '/Rattan Bench/u1.png', description: 'Hand-woven rattan over a black-lacquered steel frame. Indoor & veranda ready.', artisan: 'Mukhtar Rattan Arts, Peshawar' },
  { id: 'lp-v', name: 'Upholstered Wooden Slipper Chair', category: 'Chair', usdPrice: 295, pkrPrice: 82600, img: '/Upholstered Wooden Slipper Chair/v1.png', description: 'Low-profile slipper chair with hand-carved walnut legs and block-print upholstery.', artisan: 'Fazal Ahmad, Chiniot Master Guild' },
  { id: 'lp-vc', name: 'Handmade Canella Chair', category: 'Chair', usdPrice: 265, pkrPrice: 74200, img: '/handmade Canella/v.png', description: 'Sculptural canella cane chair woven in a traditional spiral pattern.', artisan: 'Rasheed Furniture Co., Rawalpindi' },
];

/* ============================================================
   NAV DATA
   ============================================================ */
const NAV_ITEMS = [
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

const SUBCATEGORIES = [
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
  { value: 'newest', label: 'New Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const MATERIALS = ['Walnut Wood', 'Teak', 'Rattan', 'Leather', 'Kilim', 'Jute', 'Palm Leaf', 'Cotton'];
const PRICE_RANGES = [
  { label: 'Under $150', min: 0, max: 150 },
  { label: '$150 – $250', min: 150, max: 250 },
  { label: '$250 – $400', min: 250, max: 400 },
  { label: '$400+', min: 400, max: Infinity },
];

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
export default function ShopPage({ initialProducts }: ShopPageProps) {
  /* ---- Header state ---- */
  const [scrolled, setScrolled] = useState(true); // always solid on shop page
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<(ProductItem & { quantity: number })[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  /* ---- Shop state ---- */
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeMaterials, setActiveMaterials] = useState<string[]>([]);
  const [activePriceRange, setActivePriceRange] = useState<{ min: number; max: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'collections' | 'inspiration'>('products');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  /* ---- Combined products ---- */
  const allProducts = useMemo(() => {
    const combined = [...initialProducts];
    LOCAL_PRODUCTS.forEach(lp => {
      if (!combined.some(p => p.name.toLowerCase() === lp.name.toLowerCase())) {
        combined.push(lp);
      }
    });
    return combined;
  }, [initialProducts]);

  /* ---- Filtered + sorted ---- */
  const displayProducts = useMemo(() => {
    let list = [...allProducts];

    // Subcategory filter
    if (activeSubcat) {
      list = list.filter(p => p.category === activeSubcat);
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

  /* ---- Add to cart ---- */
  const addToCart = useCallback((product: ProductItem) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

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
              <input
                type="text"
                placeholder="Search handcrafted pieces…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                className="pb-search-input"
              />
              <button className="pb-search-btn" aria-label="Search">
                <i className="fa-solid fa-magnifying-glass" />
              </button>
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
          {NAV_ITEMS.map(({ name, active, extraClass }) => (
            <a
              key={name}
              href={name === 'Living' ? '#' : '/'}
              className={`pb-cat-link${extraClass ? ` ${extraClass}` : ''}${active ? ' pb-cat-active' : ''}`}
            >
              {name}
            </a>
          ))}
        </nav>

        {/* Row 5 — Promo bar */}
        <div className="pb-promo-bar">
          {[
            { title: 'Free Shipping*', sub: 'On orders over $150 ›' },
            { title: 'Bespoke Commissions', sub: 'Custom made to order ›' },
            { title: '400+ Years of Craft', sub: 'Artisan-sourced pieces ›' },
            { title: 'Arrives in 2–4 Weeks', sub: 'Shop in-stock furniture ›' },
          ].map((item, i) => (
            <React.Fragment key={item.title}>
              {i > 0 && <div className="pb-promo-sep" />}
              <div className="pb-promo-item">
                <strong>{item.title}</strong>
                <span>{item.sub}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

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
                  <div className="cart-item-price">${(item.usdPrice * item.quantity).toLocaleString()}</div>
                </div>
                <button className="cart-item-remove" onClick={() => setCart(c => c.filter(i => i.id !== item.id))}>
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
              <span>${cart.reduce((s, i) => s + i.usdPrice * i.quantity, 0).toLocaleString()}</span>
            </div>
            <button className="shop-checkout-btn">Proceed to Checkout</button>
          </div>
        )}
      </aside>

      {/* =====================================================
           FILTER DRAWER
         ===================================================== */}
      {filterOpen && <div className="shop-filter-backdrop" onClick={() => setFilterOpen(false)} />}
      <aside className={`shop-filter-drawer${filterOpen ? ' open' : ''}`} data-lenis-prevent>
        <div className="shop-filter-head">
          <span>Filter</span>
          <button onClick={() => setFilterOpen(false)}><i className="fa-solid fa-xmark" /></button>
        </div>

        <div className="shop-filter-section">
          <div className="shop-filter-label">Category</div>
          {['Bench', 'Chair', 'Stool', 'Lounge', 'Sofa', 'Storage'].map(cat => (
            <label key={cat} className="shop-filter-check">
              <input
                type="checkbox"
                checked={activeSubcat === cat}
                onChange={() => setActiveSubcat(prev => prev === cat ? null : cat)}
              />
              {cat}s
            </label>
          ))}
        </div>

        <div className="shop-filter-section">
          <div className="shop-filter-label">Material</div>
          {MATERIALS.map(mat => (
            <label key={mat} className="shop-filter-check">
              <input
                type="checkbox"
                checked={activeMaterials.includes(mat)}
                onChange={() => toggleMaterial(mat)}
              />
              {mat}
            </label>
          ))}
        </div>

        <div className="shop-filter-section">
          <div className="shop-filter-label">Price</div>
          {PRICE_RANGES.map(range => (
            <label key={range.label} className="shop-filter-check">
              <input
                type="checkbox"
                checked={activePriceRange?.label === range.label}
                onChange={() => setActivePriceRange(prev => prev?.label === range.label ? null : { ...range, label: range.label } as any)}
              />
              {range.label}
            </label>
          ))}
        </div>

        {hasFilters && (
          <button className="shop-filter-clear" onClick={clearFilters}>Clear All Filters</button>
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
            &nbsp;Living
          </a>
        </div>

        {/* Category title row */}
        <div className="shop-title-row">
          <div className="shop-title-left">
            <h1 className="shop-title">All Living Room</h1>
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

        {/* Subcategory horizontal scroll */}
        <div className="shop-subcat-scroll">
          {SUBCATEGORIES.map(sub => (
            <button
              key={sub.label}
              className={`shop-subcat-item${activeSubcat === sub.filter ? ' active' : ''}`}
              onClick={() => setActiveSubcat(prev => prev === sub.filter ? null : sub.filter)}
            >
              <div className="shop-subcat-img-wrap">
                <img src={sub.img} alt={sub.label} />
              </div>
              <span className="shop-subcat-label">{sub.label}</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="shop-divider" />

        {/* Filter / Sort sticky bar */}
        <div className="shop-filterbar">
          <button className="shop-filter-btn" onClick={() => setFilterOpen(true)}>
            <i className="fa-solid fa-sliders" style={{ marginRight: '0.5rem' }} />
            Filter
          </button>

          <div className="shop-filterbar-right">
            {hasFilters && (
              <button className="shop-clear-link" onClick={clearFilters}>Clear All</button>
            )}
            <div className="shop-sort-wrap">
              <select
                className="shop-sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down shop-sort-icon" />
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
                {(activePriceRange as any).label}
                <button onClick={() => setActivePriceRange(null)}><i className="fa-solid fa-xmark" /></button>
              </span>
            )}
          </div>
        )}

        {/* Product Grid */}
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
                    <img
                      src={product.img}
                      alt={product.name}
                      className="shop-card-img"
                      onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id}/600/500`; }}
                    />

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
                    <a href="#" className="shop-card-name">{product.name}</a>

                    {/* Artisan */}
                    <div className="shop-card-artisan">{product.artisan}</div>

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
