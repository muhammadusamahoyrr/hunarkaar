'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SiteShell, { useSiteContext, SafeImg } from './SiteShell';
import { artisanSlugFor } from '@/lib/artisans';
import type { ProductItem } from '@/lib/siteData';

// Evocative unsplash bedroom/bed collection lifestyle imagery
const U = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=80`;

const IMG_HERO      = U('photo-1616594039964-ae9021a400a0', 1600); // Styled modern bed
const IMG_LOOK      = U('photo-1540518614846-7eded433c457', 1600); // Bedroom styled coordinates
const IMG_WALNUT    = U('photo-1533090161767-e6ffed986c88', 600);  // Macro close-up wood
const IMG_LINEN     = U('photo-1583847268964-b28dc8f51f92', 600);  // Belgian linen fabric texture
const IMG_BRASS     = U('photo-1618220179428-22790b461013', 600);  // Solid brass hardware accent
const IMG_BREAK     = U('photo-1505693416388-ac5ce068fe85', 1200); // Evocative bedroom shot

interface BedProduct extends ProductItem {
  gallery?: string[];
  dimensions?: string;
}

interface Hotspot {
  id: string;
  x: number; // percentage left
  y: number; // percentage top
  name: string;
  price: string;
  img: string;
  link: string;
}

const ROOM_HOTSPOTS: Hotspot[] = [
  {
    id: 'hs-1',
    x: 24,
    y: 56,
    name: 'Chiniot Walnut Nightstand',
    price: '$280',
    img: 'https://images.unsplash.com/photo-1532372320978-9b4d8a3a0245?w=200&q=80',
    link: '/dining',
  },
  {
    id: 'hs-2',
    x: 52,
    y: 65,
    name: 'Belgian Flax Linen Duvet Set',
    price: '$220',
    img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=200&q=80',
    link: '/textiles',
  },
  {
    id: 'hs-3',
    x: 48,
    y: 20,
    name: 'Hand-blown Glass Pendant Light',
    price: '$140',
    img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&q=80',
    link: '/lighting',
  },
];

/* ============================================================
   PRODUCT CARD — two-angle hover display
   ============================================================ */
function BedProductCard({ product }: { product: BedProduct }) {
  const { addToCart, setQuickView, formatPrice } = useSiteContext();
  const makerName = product.artisan.split(',')[0];
  const makerSlug = artisanSlugFor(product.artisan);

  // Fallback gallery images
  const secondImg = product.gallery && product.gallery.length > 1 ? product.gallery[1] : product.img;

  return (
    <div className="bed-card cp-card">
      <div className="bed-card-img-wrap cp-card-img-wrap">
        <Link href={`/shop/product/${product.id}`} className="cp-card-img-link" aria-label={product.name}>
          <SafeImg src={product.img} fallback={IMG_HERO} alt={product.name} className="cp-card-img" />
          {secondImg !== product.img && (
            <img src={secondImg} alt={`${product.name} alternate angle`} className="bed-card-img-secondary" />
          )}
        </Link>
        <div className="cp-card-strip">
          {makerSlug ? (
            <Link href={`/artisans/${makerSlug}`} className="cp-card-artisan">
              {makerName}
            </Link>
          ) : (
            <span className="cp-card-artisan">{makerName}</span>
          )}
          <div className="cp-card-strip-actions">
            <button type="button" className="cp-strip-link" onClick={() => setQuickView(product)}>
              Quick View
            </button>
            <button type="button" className="cp-strip-link" onClick={() => addToCart(product)}>
              Add to Bag
            </button>
          </div>
        </div>
      </div>
      <div className="cp-card-info">
        <p className="cp-card-cat">{product.category} Bed</p>
        <h3 className="cp-card-name">
          <Link href={`/shop/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="cp-card-price">{formatPrice(product.usdPrice, product.pkrPrice)}</p>
      </div>
    </div>
  );
}

/* ============================================================
   BED CATEGORY CONTENT
   ============================================================ */
function BedCategoryContent({ products, crossSellProducts }: { products: BedProduct[]; crossSellProducts: ProductItem[] }) {
  const { currency, setCurrency, openBespoke } = useSiteContext();
  const [activeType, setActiveType] = useState('All');
  const [activeSize, setActiveSize] = useState('All');
  const [activePrice, setActivePrice] = useState('All');
  const [activeSort, setActiveSort] = useState('Newest');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const filterBarRef = useRef<HTMLDivElement>(null);
  const hotspotsContainerRef = useRef<HTMLDivElement>(null);

  /* ---- Filter and Sort beds ---- */
  const displayProducts = products
    .filter(p => {
      // Type Filter
      if (activeType !== 'All' && !p.category.toLowerCase().includes(activeType.toLowerCase())) return false;
      // Size Filter (we mock match sizes since we are using local dataset)
      if (activeSize !== 'All') {
        const hash = p.name.charCodeAt(0) + p.name.charCodeAt(1);
        const sizes = hash % 2 === 0 ? ['King', 'Queen'] : ['Queen', 'Twin'];
        if (!sizes.includes(activeSize)) return false;
      }
      // Price Filter
      if (activePrice !== 'All') {
        if (activePrice === 'Under $1000' && p.usdPrice >= 1000) return false;
        if (activePrice === '$1000+' && p.usdPrice < 1000) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (activeSort === 'Price ↑') return a.usdPrice - b.usdPrice;
      if (activeSort === 'Price ↓') return b.usdPrice - a.usdPrice;
      return 0;
    });

  /* ---- Close active hotspots on clicking outside ---- */
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        hotspotsContainerRef.current &&
        !hotspotsContainerRef.current.contains(e.target as Node)
      ) {
        setActiveHotspot(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  /* ---- GSAP Scroll Animations ---- */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      document.querySelectorAll('.bed-fade-in').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const resetFilters = () => {
    setActiveType('All');
    setActiveSize('All');
    setActivePrice('All');
  };

  const isAsymmetric = displayProducts.length > 3;

  return (
    <main className="bed-main">
      {/* ====================================================
           SPLIT HERO SECTION (55/45)
         ==================================================== */}
      <section className="bed-hero">
        <div className="bed-hero-canvas">
          <img src={IMG_HERO} alt="Premium master bedroom showcase" />
          <div className="bed-hero-overlay" />
          <div className="bed-hero-text">
            <h1 className="bed-hero-title">Sleep, Elevated</h1>
            <p className="bed-hero-tagline">
              Beds detailed with organic walnut wood joinery, raw Belgian linens, and authentic artisan craft.
            </p>
            <a
              href="#bed-catalog"
              className="bed-hero-cta"
              onClick={e => {
                e.preventDefault();
                document.getElementById('bed-catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Bed Collections &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================
           SEGMENTED CAPSULE FILTER BAR (Horizontal Swipe)
         ==================================================== */}
      <div className="bed-filter-bar-sticky" ref={filterBarRef}>
        <div className="bed-filter-bar">
          <div className="bed-filter-left">
            <span className="cp-filter-label">Type:</span>
            <div className="bed-filter-track">
              {['All', 'Platform', 'Storage', 'Canopy'].map(t => (
                <button
                  key={t}
                  className={`bed-filter-pill${activeType === t ? ' active' : ''}`}
                  onClick={() => setActiveType(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <span className="cp-filter-label" style={{ marginLeft: '1.2rem' }}>Size:</span>
            <div className="bed-filter-track">
              {['All', 'Queen', 'King'].map(s => (
                <button
                  key={s}
                  className={`bed-filter-pill${activeSize === s ? ' active' : ''}`}
                  onClick={() => setActiveSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <span className="cp-filter-label" style={{ marginLeft: '1.2rem' }}>Price:</span>
            <div className="bed-filter-track">
              {['All', 'Under $1000', '$1000+'].map(p => (
                <button
                  key={p}
                  className={`bed-filter-pill${activePrice === p ? ' active' : ''}`}
                  onClick={() => setActivePrice(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="bed-filter-right">
            <span className="cp-filter-count">
              {displayProducts.length} {displayProducts.length === 1 ? 'piece' : 'pieces'}
            </span>
            <div className="bed-filter-track">
              {(['USD', 'PKR'] as const).map(curr => (
                <button
                  key={curr}
                  type="button"
                  className={`bed-filter-pill${currency === curr ? ' active' : ''}`}
                  onClick={() => setCurrency(curr)}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
           PRODUCT GRID (Asymmetric vs Standard Grid)
         ==================================================== */}
      <section id="bed-catalog" className="panel-linen" style={{ padding: '4rem 4% 6rem' }}>
        {displayProducts.length === 0 ? (
          <div className="cp-empty-state" style={{ padding: '80px 0', textAlign: 'center' }}>
            <p>No beds match your filter selection.</p>
            <button className="cta-link" onClick={resetFilters} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
              Clear All Filters
            </button>
          </div>
        ) : isAsymmetric ? (
          /* Asymmetric Mosaic Grid */
          <div className="bed-grid asymmetric">
            {/* Feature Card (2 Columns Wide) */}
            <div className="bed-grid-feature-card">
              <div className="bed-feature-img-wrap">
                <img src={displayProducts[0].img} alt={displayProducts[0].name} />
              </div>
              <div className="bed-feature-content">
                <div className="bed-feature-content-left">
                  <span className="bed-feature-tag">Featured Bed</span>
                  <h2 className="bed-feature-title">{displayProducts[0].name}</h2>
                  <span className="bed-feature-price-hero">
                    From {currency === 'USD' ? `$${displayProducts[0].usdPrice}` : `PKR ${displayProducts[0].pkrPrice.toLocaleString()}`}
                  </span>
                </div>
                <div className="bed-feature-content-right">
                  <div className="bed-feature-meta-item">
                    <span className="bed-feature-meta-label">Dimensions</span>
                    <span className="bed-feature-meta-val">{displayProducts[0].dimensions || 'Standard King'}</span>
                  </div>
                  <div className="bed-feature-meta-item cta-only">
                    <Link href={`/shop/product/${displayProducts[0].id}`} className="cta-link">
                      Inquire &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Secondary image container below the text block (full card width) */}
              {displayProducts[0].gallery && displayProducts[0].gallery.length > 1 && (
                <div className="bed-feature-img-wrap second">
                  <img src={displayProducts[0].gallery[1]} alt={`${displayProducts[0].name} detail`} />
                </div>
              )}

              {/* Duplicate details layout below the bottom image container */}
              <div className="bed-feature-content second">
                <div className="bed-feature-content-left">
                  <span className="bed-feature-tag">Featured Detail</span>
                  <h2 className="bed-feature-title">{displayProducts[0].name}</h2>
                  <span className="bed-feature-price-hero">
                    From {currency === 'USD' ? `$${displayProducts[0].usdPrice}` : `PKR ${displayProducts[0].pkrPrice.toLocaleString()}`}
                  </span>
                </div>
                <div className="bed-feature-content-right">
                  <div className="bed-feature-meta-item">
                    <span className="bed-feature-meta-label">Dimensions</span>
                    <span className="bed-feature-meta-val">{displayProducts[0].dimensions || 'Standard King'}</span>
                  </div>
                  <div className="bed-feature-meta-item cta-only">
                    <Link href={`/shop/product/${displayProducts[0].id}`} className="cta-link">
                      Inquire &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Grid Cards */}
            <BedProductCard product={displayProducts[1]} />
            <BedProductCard product={displayProducts[2]} />

            {/* Inline Editorial quote break card */}
            <div className="bed-grid-editorial-card cp-grid-editorial-card">
              <img src={IMG_BREAK} alt="Bedroom interior craft inspiration" className="cp-grid-editorial-img" />
              <div className="cp-grid-editorial-overlay">
                <span className="cp-grid-editorial-text">
                  "The bedroom is not a room.<br />It is the sanctuary of the mind."
                </span>
                <span className="cp-grid-editorial-attr">— Heritage Living Journal</span>
              </div>
            </div>

            {/* Rest of items */}
            {displayProducts.slice(3).map(product => (
              <BedProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Fallback Standard Grid Layout */
          <div className="bed-grid standard">
            {displayProducts.map(product => (
              <BedProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ====================================================
           INTERACTIVE HOTSPOT MODULE (Shop the Look)
         ==================================================== */}
      <section className="bed-look-section bed-fade-in">
        <div className="bed-look-header">
          <span className="editorial-eyebrow">SHOP THE INSPIRATION</span>
          <h2 className="bed-look-title">Complete the Sanctuary</h2>
          <p className="bed-look-subtitle">Click on the markers to view styled bedside furniture, bedding and lighting coordinates.</p>
        </div>

        <div className="bed-look-container" ref={hotspotsContainerRef}>
          <img src={IMG_LOOK} alt="Styled bedroom coordinates" className="bed-look-img" />
          {ROOM_HOTSPOTS.map(pin => (
            <div
              key={pin.id}
              className={`bed-hotspot-pin${activeHotspot === pin.id ? ' active' : ''}`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            >
              {/* Pulsing trigger dot */}
              <button
                type="button"
                className="bed-hotspot-dot"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(activeHotspot === pin.id ? null : pin.id);
                }}
                aria-label={`View coordinates for ${pin.name}`}
              />

              {/* Popover detail panel */}
              <div className="bed-hotspot-popover" onClick={e => e.stopPropagation()}>
                <img src={pin.img} alt={pin.name} />
                <div className="bed-hotspot-popover-info">
                  <h4>{pin.name}</h4>
                  <span className="bed-hotspot-price">{pin.price}</span>
                  <a href={pin.link} className="bed-hotspot-shop-link">View Collection &rarr;</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
           MATERIAL & CRAFT GRID SECTION
         ==================================================== */}
      <section className="bed-craft-section bed-fade-in">
        <div className="bed-craft-header">
          <span className="editorial-eyebrow">STRUCTURAL PROVENANCE</span>
          <h2 className="bed-craft-title">Honest Materials. Solid Craft.</h2>
        </div>

        <div className="bed-craft-grid">
          {/* Card 1: Wild Walnut Wood */}
          <div className="bed-craft-card">
            <div className="bed-craft-img">
              <img src={IMG_WALNUT} alt="Solid wild walnut wood grains close-up" />
            </div>
            <div className="bed-craft-content">
              <h3>Wild Walnut Wood</h3>
              <p>Sourced from seasoned forest timbers in northern Pakistan, our walnut is finished with natural organic oils to display the raw natural grains.</p>
            </div>
          </div>

          {/* Card 2: Raw Flax Belgian Linen */}
          <div className="bed-craft-card">
            <div className="bed-craft-img">
              <img src={IMG_LINEN} alt="Organic Belgian flax linen closeup woven texture" />
            </div>
            <div className="bed-craft-content">
              <h3>Belgian Flax Linen</h3>
              <p>Strong, sustainable, and naturally breathable. Upholstered using raw linen yarns that soften organically with age and use.</p>
            </div>
          </div>

          {/* Card 3: Solid Brass Hardware */}
          <div className="bed-craft-card">
            <div className="bed-craft-img">
              <img src={IMG_BRASS} alt="Hand-turned solid brass rivets and connectors" />
            </div>
            <div className="bed-craft-content">
              <h3>Hand-cast Brass Joinery</h3>
              <p>Traditional structural fasteners sand-cast in local Lahore foundries. These brass details oxidize over time, developing a unique antique patina.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
           CROSS SELL SECTION
         ==================================================== */}
      {crossSellProducts.length > 0 && (
        <section className="cp-crosssell bed-fade-in">
          <div className="cp-crosssell-header">
            <span className="cp-crosssell-sub">COORDINATE PIECES</span>
            <h2 className="cp-crosssell-title">Complete Your Space</h2>
          </div>
          <div className="cp-crosssell-row">
            {crossSellProducts.slice(0, 4).map(product => (
              <div key={product.id} className="cp-crosssell-card">
                <BedProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ====================================================
           BESPOKE COMMISSION BANNER
         ==================================================== */}
      <section className="cp-bespoke panel-sandstone bed-fade-in" style={{ margin: '3rem 0 0' }}>
        <span className="editorial-eyebrow cp-ink-soft">EXCLUSIVE ENGAGEMENTS</span>
        <h2 className="cp-bespoke-title">Bespoke Bed Dimensions</h2>
        <p className="cp-bespoke-body">
          Commission a bed customized to your specific mattress height, wood finish preferences, and customized tapestry colors. Certified authentic structural designs.
        </p>
        <button
          type="button"
          className="cta-link cp-ink-cta cp-bespoke-cta"
          onClick={() => openBespoke('Bespoke Bedroom Commissions')}
        >
          Inquire Bedroom Commission
        </button>
      </section>
    </main>
  );
}

/* ============================================================
   EXPORT BED CATEGORY PAGE COMPONENT — wrapped in SiteShell
   ============================================================ */
interface BedCategoryPageProps {
  products: BedProduct[];
  crossSellProducts: ProductItem[];
}

export default function BedCategoryPage(props: BedCategoryPageProps) {
  return (
    <SiteShell scope="page-bed">
      <BedCategoryContent {...props} />
    </SiteShell>
  );
}
