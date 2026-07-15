'use client';

import React, { useState, useEffect, useRef } from 'react';
import SiteShell, { useSiteContext, SafeImg } from './SiteShell';
import type { ProductItem } from '@/lib/siteData';
import type { LocalProduct } from '@/lib/localProducts';
import { artisanSlugFor } from '@/lib/artisans';

interface ProductDetailProps {
  product: LocalProduct;
  related: ProductItem[];
}

/* Deterministic listing data derived from the product id
   (no discounts / reviews / seller stats in the DB yet) */
function deriveListing(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const rating = Math.round((4.6 + (h % 40) / 100) * 10) / 10; // 4.6–4.9
  return {
    hash: h,
    rating,
    reviews: 48 + (h % 220),                                   // 48–267
    sold: 300 + (h % 1400),                                    // 300–1699
    baskets: 3 + (h % 12),                                     // 3–14
    discountPct: 20 + (h % 26),                                // 20–45
    recommend: 85 + (h % 14),                                  // 85–98 %
    quality: Math.min(5, Math.round((rating + 0.1) * 10) / 10),
    delivery: Math.round((rating - 0.3) * 10) / 10,
    service: Math.round((rating - 0.1) * 10) / 10,
    favourites: 800 + (h % 3200),
    shopSales: 400 + (h % 3000),
    estYear: 2016 + (h % 8),                                   // "X years on Hunarkar"
  };
}

/* Five-star display, gold fill proportional to the rating */
function StarRating({ value }: { value: number }) {
  return (
    <span className="pdp-stars" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map(i => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="pdp-star">
            <i className="fa-regular fa-star" />
            <i className="fa-solid fa-star" style={{ width: `${fill * 100}%` }} />
          </span>
        );
      })}
    </span>
  );
}

/* Circular gauge for the review breakdown (value out of 5, or a % if suffix) */
function Gauge({ value, label, pct }: { value: number; label: string; pct?: boolean }) {
  const R = 18;
  const C = 2 * Math.PI * R;
  const frac = pct ? value / 100 : value / 5;
  return (
    <div className="pdp-gauge">
      <svg viewBox="0 0 44 44" className="pdp-gauge-ring" aria-hidden="true">
        <circle cx="22" cy="22" r={R} className="pdp-gauge-bg" />
        <circle
          cx="22" cy="22" r={R} className="pdp-gauge-fg"
          strokeDasharray={`${frac * C} ${C}`} transform="rotate(-90 22 22)"
        />
        <text x="22" y="26" className="pdp-gauge-num">{pct ? `${value}%` : value.toFixed(1)}</text>
      </svg>
      <span className="pdp-gauge-label">{label}</span>
    </div>
  );
}

/* Derive material tags from the product name (mirrors ShopPage logic) */
function getMaterials(name: string): string[] {
  const n = name.toLowerCase();
  const found: string[] = [];
  if (n.includes('walnut')) found.push('Walnut Wood');
  if (n.includes('teak')) found.push('Teak');
  if (n.includes('rattan')) found.push('Rattan');
  if (n.includes('leather')) found.push('Leather');
  if (n.includes('kilim')) found.push('Kilim');
  if (n.includes('jute')) found.push('Jute');
  if (n.includes('palm')) found.push('Palm Leaf');
  if (n.includes('cotton')) found.push('Cotton');
  if (n.includes('cane') || n.includes('canella')) found.push('Cane');
  if (n.includes('woven') && found.length === 0) found.push('Handwoven Fibre');
  return found.length ? found : ['Artisan Materials'];
}

/* ============================================================
   PDP CONTENT
   ============================================================ */
function DetailContent({ product, related }: ProductDetailProps) {
  const { addToCart, formatPrice, setCartOpen } = useSiteContext();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const [openAcc, setOpenAcc] = useState<string | null>('details');
  const [faved, setFaved] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [size, setSize] = useState('');
  const [finish, setFinish] = useState('');
  const [showVarErr, setShowVarErr] = useState(false);
  const sizeRef = useRef<HTMLSelectElement>(null);
  const finishRef = useRef<HTMLSelectElement>(null);

  const materials = getMaterials(product.name);
  const L = deriveListing(product.id);

  /* Inflated "original" price for the sale strikethrough */
  const compareUsd = Math.round(product.usdPrice / (1 - L.discountPct / 100));
  const comparePkr = Math.round(product.pkrPrice / (1 - L.discountPct / 100));

  const SIZE_OPTS = [`Standard — ${product.dimensions}`, 'Compact (−15%)', 'Extended (+20%)'];
  const FINISH_OPTS = ['Natural Oil', 'Dark Walnut', 'Espresso', 'Whitewash'];

  /* Chosen size adjusts the price (finish does not) */
  const SIZE_MODIFIER: Record<string, number> = { 'Compact (−15%)': 0.85, 'Extended (+20%)': 1.2 };
  const sizeMult = SIZE_MODIFIER[size] ?? 1;
  const unitUsd = Math.round(product.usdPrice * sizeMult);
  const unitPkr = Math.round(product.pkrPrice * sizeMult);
  const unitCompareUsd = Math.round(compareUsd * sizeMult);
  const unitComparePkr = Math.round(comparePkr * sizeMult);

  const variantValid = size !== '' && finish !== '';
  const shortSize = size.replace(/\s+—.*$/, '').replace(/\s+\(.*$/, ''); // "Standard" / "Compact" / "Extended"

  /* Split "Name, Place" into maker + studio/location for the seller card */
  const [makerName, ...rest] = product.artisan.split(',');
  const makerPlace = rest.join(',').trim();
  const makerInitials = makerName.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  /* Null when no artisan in the registry claims this string — the name then
     renders as plain text rather than a link into a 404. */
  const artisanSlug = artisanSlugFor(product.artisan);

  /* Customer photos for the "Photos from reviews" strip */
  const reviewPhotos = [...product.gallery, ...related.map(r => r.img)].slice(0, 6);

  /* Dates are computed client-side only to avoid SSR hydration mismatches */
  const [dates, setDates] = useState<{ saleEnd: string; ship1: string; ship2: string } | null>(null);
  useEffect(() => {
    const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const now = new Date();
    const add = (n: number) => { const d = new Date(now); d.setDate(now.getDate() + n); return d; };
    setDates({
      saleEnd: fmt(add(6 + (L.hash % 10))),   // sale ends 6–15 days out
      ship1: fmt(add(14)),                     // ~2 weeks
      ship2: fmt(add(35)),                     // ~5 weeks
    });
  }, [L.hash]);

  /* PDP has no hero — keep the fixed header in its solid (dark-text) state */
  useEffect(() => {
    const hdr = document.getElementById('site-header');
    if (!hdr) return;
    hdr.classList.add('scrolled');
    const obs = new MutationObserver(() => {
      if (!hdr.classList.contains('scrolled')) hdr.classList.add('scrolled');
    });
    obs.observe(hdr, { attributes: true, attributeFilter: ['class'] });
    return () => { obs.disconnect(); hdr.classList.remove('scrolled'); };
  }, []);

  /* A configured line carries the variant in its id/name/price so the
     bag shows exactly what was chosen (and priced) */
  const buildVariant = () => ({
    ...product,
    id: `${product.id}|${shortSize}|${finish}`,
    name: `${product.name} — ${shortSize} · ${finish}`,
    usdPrice: unitUsd,
    pkrPrice: unitPkr,
  });

  const focusFirstInvalid = () => {
    setShowVarErr(true);
    const el = size === '' ? sizeRef.current : finishRef.current;
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el?.focus({ preventScroll: true });
  };

  const handleAdd = () => {
    if (!variantValid) { focusFirstInvalid(); return; }
    const v = buildVariant();
    for (let i = 0; i < qty; i++) addToCart(v);   // addToCart also opens the bag = confirmation
  };
  const handleBuyNow = () => {
    if (!variantValid) { focusFirstInvalid(); return; }
    handleAdd(); setCartOpen(true);
  };

  const stepImg = (dir: number) => {
    const n = product.gallery.length;
    setActiveImg(i => (i + dir + n) % n);
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  const toggleAcc = (id: string) => setOpenAcc(prev => (prev === id ? null : id));

  const ACCORDIONS: { id: string; label: string; body: React.ReactNode }[] = [
    { id: 'details', label: 'Item details', body: (
      <div className="pdp-highlights">
        <div className="pdp-highlight"><i className="fa-solid fa-hand-sparkles" /><div><strong>Handmade</strong><span>One artisan, start to finish</span></div></div>
        <div className="pdp-highlight"><i className="fa-solid fa-ruler-combined" /><div><strong>Made to order</strong><span>Crafted just for you</span></div></div>
        <div className="pdp-highlight"><i className="fa-solid fa-tree" /><div><strong>{materials[0]}</strong><span>Sustainably sourced</span></div></div>
        <div className="pdp-highlight"><i className="fa-solid fa-earth-asia" /><div><strong>Ships from Pakistan</strong><span>Worldwide delivery</span></div></div>
      </div>
    ) },
    { id: 'dimensions', label: 'Dimensions', body: (
      <p>{product.dimensions}<br /><span className="pdp-acc-muted">Each piece is handmade, so dimensions may vary slightly.</span></p>
    ) },
    { id: 'materials', label: 'Materials', body: (
      <ul className="pdp-acc-list">{materials.map(m => <li key={m}>{m}</li>)}<li>Solid hardwood joinery, no metal fasteners</li></ul>
    ) },
    { id: 'care', label: 'Care Instructions', body: (
      <p>Dust with a soft dry cloth. Keep away from direct sunlight and radiators. Treat wood with natural oil twice a year; spot-clean woven surfaces with a barely-damp cloth.</p>
    ) },
  ];

  return (
    <main className="pdp">
      {/* Breadcrumb */}
      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span>/</span>
        <a href="/shop/living">Living</a><span>/</span>
        <span className="pdp-bc-cat">{product.category}</span><span>/</span>
        <span className="pdp-bc-current">{product.name}</span>
      </nav>

      <div className="pdp-layout">
        {/* ── LEFT: gallery ── */}
        <div className="pdp-gallery">
          <div className="pdp-thumbs" role="tablist" aria-label="Product images">
            {product.gallery.map((src, i) => (
              <button
                key={src}
                className={`pdp-thumb${i === activeImg ? ' active' : ''}`}
                onClick={() => setActiveImg(i)}
                onMouseEnter={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                aria-selected={i === activeImg}
              >
                <SafeImg src={src} fallback={`https://picsum.photos/seed/${product.id}-${i}/200/250`} alt={`${product.name} view ${i + 1}`} />
              </button>
            ))}
          </div>

          <div
            className={`pdp-main-img${zoom ? ' zooming' : ''}`}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={onMove}
          >
            <span className="pdp-pick-badge"><i className="fa-solid fa-wand-magic-sparkles" /> Editor’s Pick</span>
            <button
              className={`pdp-img-fav${faved ? ' faved' : ''}`}
              onClick={() => setFaved(f => !f)}
              aria-pressed={faved}
              aria-label={faved ? 'Remove from favourites' : 'Add to favourites'}
            >
              <i className={`fa-${faved ? 'solid' : 'regular'} fa-heart`} />
            </button>

            <img
              src={product.gallery[activeImg]}
              alt={product.name}
              style={{ transformOrigin: origin }}
              onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id}-main/900/1100`; }}
            />

            {product.gallery.length > 1 && (
              <>
                <button className="pdp-nav-arrow prev" onClick={() => stepImg(-1)} aria-label="Previous image"><i className="fa-solid fa-chevron-left" /></button>
                <button className="pdp-nav-arrow next" onClick={() => stepImg(1)} aria-label="Next image"><i className="fa-solid fa-chevron-right" /></button>
              </>
            )}
            <span className="pdp-zoom-hint"><i className="fa-solid fa-magnifying-glass-plus" /> Hover to zoom</span>
          </div>
        </div>

        {/* ── RIGHT: info ── */}
        <div className="pdp-info">
          {/* Sale price block */}
          <div className="pdp-price-block">
            <div className="pdp-price-row">
              <span className="pdp-price">Now {formatPrice(unitUsd, unitPkr)}</span>
              <span className="pdp-price-was">{formatPrice(unitCompareUsd, unitComparePkr)}</span>
            </div>
            <div className="pdp-sale-line">
              <span className="pdp-off">{L.discountPct}% off</span>
              {dates && <span className="pdp-sale-ends">· Sale ends {dates.saleEnd}</span>}
            </div>
          </div>

          <h1 className="pdp-title">{product.name}</h1>

          {/* Shop + rating line */}
          <div className="pdp-rating-row">
            {artisanSlug ? (
              <a href={`/artisans/${artisanSlug}`} className="pdp-shop-link">
                <i className="fa-solid fa-certificate" /> {makerName.trim()}
              </a>
            ) : (
              <span className="pdp-shop-link"><i className="fa-solid fa-certificate" /> {makerName.trim()}</span>
            )}
            <StarRating value={L.rating} />
            <span className="pdp-rating-value">{L.rating.toFixed(1)}</span>
            <a href="#pdp-reviews" className="pdp-rating-count">{L.reviews} reviews</a>
            <span className="pdp-rating-sep">·</span>
            <span className="pdp-rating-sold">{L.sold.toLocaleString()} sold</span>
          </div>

          <p className="pdp-desc">{product.description}</p>

          {/* Provenance badges */}
          <div className="pdp-badges">
            <span className="pdp-badge">
              <svg className="pdp-badge-flag" viewBox="0 0 30 20" role="img" aria-label="Pakistan flag">
                <rect width="30" height="20" fill="#01411c" />
                <rect width="7.5" height="20" fill="#ffffff" />
                <circle cx="18.2" cy="10" r="4.2" fill="#ffffff" />
                <circle cx="19.9" cy="9.2" r="3.5" fill="#01411c" />
                <path d="M22,5.3 L22.53,6.77 L24.09,6.82 L22.86,7.78 L23.29,9.28 L22,8.4 L20.71,9.28 L21.14,7.78 L19.91,6.82 L21.47,6.77 Z" fill="#ffffff" />
              </svg>
              Made in Pakistan
            </span>
            <span className="pdp-badge">
              <i className="fa-solid fa-certificate" />
              100% Original Handcraft
            </span>
          </div>

          {/* Variation selectors */}
          <div className="pdp-variations">
            <label className="pdp-var">
              <span className="pdp-var-label">Size <span className="pdp-req" aria-hidden="true">*</span></span>
              <div className="pdp-select-wrap">
                <select
                  ref={sizeRef}
                  value={size}
                  onChange={e => setSize(e.target.value)}
                  aria-invalid={showVarErr && size === ''}
                  className={showVarErr && size === '' ? 'pdp-select-err' : ''}
                >
                  <option value="">Select an option</option>
                  {SIZE_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <i className="fa-solid fa-chevron-down" />
              </div>
              {showVarErr && size === '' && <span className="pdp-var-err" role="alert">Please choose a size</span>}
            </label>
            <label className="pdp-var">
              <span className="pdp-var-label">Finish <span className="pdp-req" aria-hidden="true">*</span></span>
              <div className="pdp-select-wrap">
                <select
                  ref={finishRef}
                  value={finish}
                  onChange={e => setFinish(e.target.value)}
                  aria-invalid={showVarErr && finish === ''}
                  className={showVarErr && finish === '' ? 'pdp-select-err' : ''}
                >
                  <option value="">Select a finish</option>
                  {FINISH_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <i className="fa-solid fa-chevron-down" />
              </div>
              {showVarErr && finish === '' && <span className="pdp-var-err" role="alert">Please choose a finish</span>}
            </label>
          </div>

          {/* Quantity + add */}
          <div className="pdp-buy-row">
            <div className="pdp-qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button className="pdp-add-btn" onClick={handleAdd}>Add to Bag — {formatPrice(unitUsd * qty, unitPkr * qty)}</button>
          </div>

          {/* Buy it now (favouriting lives on the gallery heart) */}
          <div className="pdp-secondary-row">
            <button className="pdp-buynow-btn" onClick={handleBuyNow}>Buy it Now</button>
          </div>

          {/* Delivery & return policies (condensed) */}
          <div className="pdp-delivery">
            <div className="pdp-delivery-row">
              <i className="fa-solid fa-calendar-check" />
              <span>Order today to get it by <strong>{dates ? `${dates.ship1} – ${dates.ship2}` : '2–5 weeks'}</strong> · ships from <strong>{makerPlace || 'Pakistan'}</strong>, worldwide</span>
            </div>
            <div className="pdp-delivery-row">
              <i className="fa-solid fa-truck-fast" />
              <span>Free delivery over $150 · <strong>14-day</strong> returns &amp; exchanges</span>
            </div>
          </div>

          {/* Accordions */}
          <div className="pdp-accordions">
            {ACCORDIONS.map(acc => (
              <div key={acc.id} className={`pdp-acc${openAcc === acc.id ? ' open' : ''}`}>
                <button className="pdp-acc-head" onClick={() => toggleAcc(acc.id)} aria-expanded={openAcc === acc.id}>
                  <span>{acc.label}</span>
                  <i className="fa-solid fa-chevron-down pdp-acc-chevron" />
                </button>
                {openAcc === acc.id && <div className="pdp-acc-body">{acc.body}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Reviews (grid places this under the gallery on desktop) ── */}
        <section className="pdp-reviews" id="pdp-reviews">
          <h2 className="pdp-reviews-title">Reviews for this item</h2>

          {/* AI summary line */}
          <div className="pdp-ai-summary">
            <span className="pdp-ai-label">What buyers say, summarised by AI</span>
            <span className="pdp-ai-chip"><i className="fa-solid fa-check" /> Beautiful craftsmanship</span>
            <span className="pdp-ai-chip"><i className="fa-solid fa-check" /> Ships well packed</span>
            <span className="pdp-ai-chip"><i className="fa-solid fa-check" /> As pictured</span>
          </div>

          {/* Rating breakdown */}
          <div className="pdp-rating-breakdown">
            <div className="pdp-rating-big">
              <div className="pdp-rating-big-num">{L.rating.toFixed(1)}</div>
              <StarRating value={L.rating} />
              <div className="pdp-rating-big-sub">Item average · {L.reviews} reviews</div>
            </div>
            <div className="pdp-gauges">
              <Gauge value={L.quality} label="Item quality" />
              <Gauge value={L.delivery} label="Delivery" />
              <Gauge value={L.service} label="Customer service" />
              <Gauge value={L.recommend} label="Buyers recommend" pct />
            </div>
          </div>

          {/* Filter pills */}
          <div className="pdp-review-filters">
            <span className="pdp-review-pill active">Suggested <i className="fa-solid fa-chevron-down" /></span>
            <span className="pdp-review-pill">Craftsmanship ({Math.round(L.reviews * 0.4)})</span>
            <span className="pdp-review-pill">Delivery ({Math.round(L.reviews * 0.3)})</span>
            <span className="pdp-review-pill">Appearance ({Math.round(L.reviews * 0.25)})</span>
            <span className="pdp-review-pill">Value ({Math.round(L.reviews * 0.2)})</span>
          </div>

          <div className="pdp-reviews-grid">
            {[
              { n: 'Amira K.', d: '2 weeks ago', s: 5, photo: reviewPhotos[1], t: `The craftsmanship is extraordinary — the ${materials[0].toLowerCase()} grain is even more beautiful in person. Worth every day of the wait.` },
              { n: 'Daniel R.', d: '1 month ago', s: 5, t: 'Arrived beautifully packed with a signed certificate. You can feel the hand-work in every joint. A true heirloom.' },
              { n: 'Sana M.', d: '2 months ago', s: 4, t: 'The maker answered all my questions before ordering and even adjusted the dimensions for my hallway. Five stars.' },
            ].map(r => (
              <figure key={r.n} className="pdp-review">
                <figcaption className="pdp-review-head">
                  <span className="pdp-review-author"><strong>{r.n}</strong><span className="pdp-review-date">{r.d}</span></span>
                  <StarRating value={r.s} />
                </figcaption>
                <blockquote>{r.t}</blockquote>
                {r.photo && (
                  <div className="pdp-review-photo">
                    <SafeImg src={r.photo} fallback={`https://picsum.photos/seed/${product.id}-rev/200/200`} alt="Customer photo" />
                  </div>
                )}
              </figure>
            ))}
          </div>

          {/* Photos from reviews */}
          <div className="pdp-review-photos">
            <h3 className="pdp-review-photos-title">Photos from reviews</h3>
            <div className="pdp-review-photos-strip">
              {reviewPhotos.map((src, i) => (
                <div key={i} className="pdp-review-photo-tile">
                  <SafeImg src={src} fallback={`https://picsum.photos/seed/${product.id}-p${i}/300/300`} alt={`Customer photo ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── Meet the maker (seller card) ── */}
      <section className="pdp-seller">
        <div className="pdp-seller-top">
          <div className="pdp-seller-head">
            <div className="pdp-seller-avatar" aria-hidden="true">{makerInitials}</div>
            <div className="pdp-seller-id">
              <div className="pdp-seller-name">
                {artisanSlug
                  ? <a href={`/artisans/${artisanSlug}`}>{makerName.trim()}</a>
                  : makerName.trim()}
              </div>
              <div className="pdp-seller-stats">
                <span className="pdp-seller-rating"><i className="fa-solid fa-star" /> {L.rating.toFixed(1)} ({L.reviews})</span>
                <span>·</span><span>{L.shopSales.toLocaleString()} sales</span>
                <span>·</span><span>{2026 - L.estYear} yrs on Hunarkar</span>
              </div>
              {makerPlace && <div className="pdp-seller-place"><i className="fa-solid fa-location-dot" /> {makerPlace}</div>}
            </div>
          </div>
          <div className="pdp-seller-actions">
            <button className={`pdp-follow-btn${followed ? ' following' : ''}`} onClick={() => setFollowed(f => !f)}>
              <i className={`fa-${followed ? 'solid' : 'regular'} fa-heart`} /> {followed ? 'Following' : 'Follow maker'}
            </button>
            <a href="#" className="pdp-message-btn">Message maker</a>
            <span className="pdp-seller-response">Typically responds within a few hours</span>
          </div>
        </div>

        <div className="pdp-seller-trust">
          <div className="pdp-trust-col"><i className="fa-solid fa-truck-fast" /><div><strong>Smooth dispatch</strong><span>A history of shipping on time with tracking.</span></div></div>
          <div className="pdp-trust-col"><i className="fa-solid fa-comments" /><div><strong>Speedy replies</strong><span>A history of replying to messages quickly.</span></div></div>
          <div className="pdp-trust-col"><i className="fa-solid fa-star" /><div><strong>Rave reviews</strong><span>Average review rating is 4.8 or higher.</span></div></div>
        </div>

        <p className="pdp-seller-msg">
          “Every piece leaves my workshop signed and wrapped by hand. Message me for custom
          dimensions, finishes, or a peek at what’s on the bench today.”
        </p>
      </section>

      {/* ── You may also like ── */}
      {related.length > 0 && (
        <section className="pdp-related">
          <h2 className="pdp-related-title">You May Also Like</h2>
          <div className="pdp-related-grid">
            {related.map(p => (
              <a key={p.id} href={`/shop/product/${p.id}`} className="pdp-rel-card">
                <div className="pdp-rel-img">
                  <SafeImg src={p.img} fallback={`https://picsum.photos/seed/${p.id}/400/500`} alt={p.name} />
                </div>
                <div className="pdp-rel-cat">{p.category}</div>
                <div className="pdp-rel-name">{p.name}</div>
                <div className="pdp-rel-price">{formatPrice(p.usdPrice, p.pkrPrice)}</div>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default function ProductDetail(props: ProductDetailProps) {
  return (
    <SiteShell>
      <DetailContent {...props} />
    </SiteShell>
  );
}
