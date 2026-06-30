'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SiteShell, { useSiteContext, SafeImg } from './SiteShell';
import type { ProductItem } from '@/lib/siteData';

/* ============================================================
   SUBCATEGORY TILE DATA
   ============================================================ */
const TEXTILES_SUBCATS = [
  {
    id: 'All',
    label: 'All Textiles',
    img: 'https://images.unsplash.com/photo-1779470703519-05af825e87cd?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'Ajrak',
    label: 'Ajrak',
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'Ralli',
    label: 'Ralli Quilts',
    img: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'Shawl',
    label: 'Shawls',
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'Phulkari',
    label: 'Phulkari',
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&auto=format&fit=crop&q=80',
  },
];

const SORT_OPTIONS = ['Newest', 'Price ↑', 'Price ↓'];

/* ============================================================
   PRODUCT CARD — Gucci-inspired minimal
   ============================================================ */
function ProductCard({ product }: { product: ProductItem }) {
  const { addToCart, setQuickView, formatPrice } = useSiteContext();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="cp-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="cp-card-img-wrap">
        <SafeImg
          src={product.img}
          fallback={`https://picsum.photos/seed/${product.id}/600/800`}
          alt={product.name}
          className="cp-card-img"
        />
        <div className={`cp-card-hover${hovered ? ' visible' : ''}`}>
          <span className="cp-card-artisan">{product.artisan.split(',')[0]}</span>
          <button
            className="cp-card-qv cta-link"
            onClick={(e) => { e.stopPropagation(); setQuickView(product); }}
          >
            Quick View
          </button>
          <button
            className="cp-card-atc"
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          >
            Add to Bag
          </button>
        </div>
      </div>
      <div className="cp-card-info">
        <p className="cp-card-cat">{product.category}</p>
        <h3 className="cp-card-name">{product.name}</h3>
        <p className="cp-card-price">{formatPrice(product.usdPrice, product.pkrPrice)}</p>
      </div>
    </div>
  );
}

/* ============================================================
   CATEGORY CONTENT — the actual page sections
   ============================================================ */
interface CategoryContentProps {
  products: ProductItem[];
  crossSellProducts: ProductItem[];
}

function CategoryContent({ products, crossSellProducts }: CategoryContentProps) {
  const { currency, setCurrency } = useSiteContext();
  const [activeSubcat, setActiveSubcat] = useState('All');
  const [activeSort, setActiveSort]     = useState('Newest');
  const filterBarRef = useRef<HTMLDivElement>(null);
  const sectionsRef  = useRef<HTMLElement[]>([]);

  /* ── filter + sort ── */
  const displayProducts = products
    .filter(p =>
      activeSubcat === 'All' ||
      p.category.toLowerCase().includes(activeSubcat.toLowerCase()) ||
      p.name.toLowerCase().includes(activeSubcat.toLowerCase())
    )
    .sort((a, b) => {
      if (activeSort === 'Price ↑') return a.usdPrice - b.usdPrice;
      if (activeSort === 'Price ↓') return b.usdPrice - a.usdPrice;
      return 0;
    });

  const firstBatch = displayProducts.slice(0, 6);
  const restBatch  = displayProducts.slice(6);

  /* ── GSAP scroll animations ── */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* fade-in each editorial panel */
      document.querySelectorAll('.cp-fade-in').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' },
          }
        );
      });

      /* stagger subcategory tiles */
      gsap.fromTo('.cp-sub-tile',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.cp-sub-row', start: 'top 85%' },
        }
      );

      /* stagger product cards */
      gsap.fromTo('.cp-card',
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.cp-grid', start: 'top 80%' },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  /* ── re-animate cards when filter changes ── */
  useEffect(() => {
    gsap.fromTo('.cp-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' }
    );
  }, [activeSubcat, activeSort]);

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <>
      {/* ====================================================
           HERO BANNER
         ==================================================== */}
      <section className="cp-hero">
        <img
          src="https://images.unsplash.com/photo-1779470703519-05af825e87cd?w=1800&auto=format&fit=crop&q=85"
          alt="Pakistani textiles — Ajrak and Ralli collection"
          className="cp-hero-bg"
        />
        <div className="cp-hero-overlay" />
        <div className="cp-hero-content">
          <span className="cp-hero-eyebrow">THE COLLECTION</span>
          <h1 className="cp-hero-title">Textiles</h1>
          <p className="cp-hero-tagline">
            Woven in Sindh, dyed in Multan,<br />finished entirely by hand.
          </p>
        </div>
        <nav className="cp-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="cp-bc-sep">/</span>
          <span>Textiles</span>
        </nav>
      </section>

      <main>
        {/* ====================================================
             HAIRLINE + EDITORIAL INTRO
           ==================================================== */}
        <div className="cp-section-divider" />

        <section className="cp-intro panel-linen cp-fade-in">
          <div className="cp-intro-image">
            <img
              src="https://images.unsplash.com/photo-1590736969955-71cb94801759?w=900&auto=format&fit=crop&q=85"
              alt="Ajrak block printing — master printer at work in Sindh"
            />
          </div>
          <div className="cp-intro-content">
            <span className="editorial-eyebrow">THE CRAFT</span>
            <h2 className="cp-intro-heading">Ajrak &amp; Ralli</h2>
            <p className="cp-intro-body">
              For four centuries, the women of Sindh have folded fabric into geometric poems.
              Block-printed with organic indigo and madder root, each Ajrak passes through
              fourteen stages of resist dyeing before it leaves the workshop. The Ralli tradition —
              geometric patchwork sewn from scraps by hand — transforms remnants into heirlooms
              that carry the fingerprints of their makers.
            </p>
            <div className="cp-intro-stats">
              <div className="cp-stat">
                <span className="cp-stat-num">{products.length || 32}</span>
                <span className="cp-stat-label">Pieces</span>
              </div>
              <div className="cp-stat-sep" />
              <div className="cp-stat">
                <span className="cp-stat-num">8</span>
                <span className="cp-stat-label">Artisans</span>
              </div>
              <div className="cp-stat-sep" />
              <div className="cp-stat">
                <span className="cp-stat-num">400</span>
                <span className="cp-stat-label">Years</span>
              </div>
            </div>
            <div className="cp-intro-ctas">
              <button className="cta-link">Shop the Collection</button>
              <button className="cta-link" style={{ fontSize: '0.78rem', opacity: 0.7 }}>
                Request a Look Book
              </button>
            </div>
          </div>
        </section>

        {/* ====================================================
             SUBCATEGORY TILES
           ==================================================== */}
        <div className="cp-section-divider" />

        <section className="cp-sub-section panel-linen">
          <div className="cp-sub-row">
            {TEXTILES_SUBCATS.map(sub => (
              <button
                key={sub.id}
                className={`cp-sub-tile${activeSubcat === sub.id ? ' active' : ''}`}
                onClick={() => setActiveSubcat(sub.id)}
              >
                <div className="cp-sub-img">
                  <img src={sub.img} alt={sub.label} />
                </div>
                <span className="cp-sub-label">{sub.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ====================================================
             STICKY FILTER BAR
           ==================================================== */}
        <div className="cp-filter-bar" ref={filterBarRef}>
          <div className="cp-filter-left">
            <span className="cp-filter-label">Sort:</span>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt}
                className={`cp-filter-opt${activeSort === opt ? ' active' : ''}`}
                onClick={() => setActiveSort(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="cp-filter-right">
            <span className="cp-filter-count">
              {displayProducts.length} {displayProducts.length === 1 ? 'piece' : 'pieces'}
              {activeSubcat !== 'All' && ` — ${activeSubcat}`}
            </span>
            <div
              className="currency-toggle"
              onClick={() => setCurrency(c => c === 'USD' ? 'PKR' : 'USD')}
              style={{ cursor: 'pointer', display: 'flex', gap: '0.4rem', fontSize: '0.72rem', letterSpacing: '0.1em' }}
            >
              <span style={{ fontWeight: currency === 'USD' ? 500 : 300 }}>USD</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span style={{ fontWeight: currency === 'PKR' ? 500 : 300 }}>PKR</span>
            </div>
          </div>
        </div>

        {/* ====================================================
             PRODUCT GRID
           ==================================================== */}
        <section className="panel-linen" style={{ paddingBottom: '80px' }}>
          {displayProducts.length === 0 ? (
            <div className="cp-empty-state">
              <p>No pieces found in this selection.</p>
              <button className="cta-link" onClick={() => setActiveSubcat('All')}>
                View All Textiles
              </button>
            </div>
          ) : (
            <>
              {/* First batch — 6 cards */}
              <div className="cp-grid">
                {firstBatch.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Mid-grid editorial break */}
              <div className="cp-editorial-break">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&auto=format&fit=crop&q=85"
                  alt="Phulkari embroidery — studio lifestyle"
                />
                <div className="cp-break-caption">
                  <span className="cp-break-text">
                    "Every stitch is a word.<br />Every panel, a sentence."
                  </span>
                  <span className="cp-break-attr">— The Phulkari Tradition, Punjab</span>
                </div>
              </div>

              {/* Rest of the grid */}
              {restBatch.length > 0 && (
                <div className="cp-grid" style={{ marginTop: '2px' }}>
                  {restBatch.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* ====================================================
             ARTISAN SPOTLIGHT
           ==================================================== */}
        <div className="cp-section-divider" />

        <section className="cp-artisan panel-sandstone cp-fade-in">
          <div className="cp-artisan-portrait">
            <img
              src="https://images.unsplash.com/photo-1590605095243-072811dbe64c?w=700&auto=format&fit=crop&crop=faces&q=85"
              alt="Master weaver — Sindh textile artisan"
            />
          </div>
          <div className="cp-artisan-content">
            <span className="editorial-eyebrow" style={{ color: 'rgba(241,237,232,0.6)' }}>THE MAKER</span>
            <h2 className="cp-artisan-name">Mai Bakhtawar</h2>
            <p className="cp-artisan-location">Bhit Shah Handloom · Sindh</p>
            <blockquote className="cp-artisan-quote">
              "My mother's hands taught these patterns to mine before I could speak.
              The indigo does not lie — it shows you exactly how patient you were."
            </blockquote>
            <p className="cp-artisan-body">
              Mai Bakhtawar has worked the block-print process for over thirty years in
              the village of Bhit Shah, a town named for the Sufi poet Shah Abdul Latif.
              Her workshop employs fourteen women from three generations of the same family.
              Every Ajrak produced here carries a certification mark stamped in the loom-room.
            </p>
            <div className="cp-artisan-ctas">
              <button className="cta-link" style={{ color: 'var(--text-on-dark)', borderColor: 'rgba(241,237,232,0.5)' }}>
                Meet All Artisans
              </button>
              <button className="cta-link" style={{ color: 'var(--text-on-dark)', borderColor: 'rgba(241,237,232,0.5)', opacity: 0.7, fontSize: '0.78rem' }}>
                Heritage Journal
              </button>
            </div>
          </div>
        </section>

        {/* ====================================================
             YOU MAY ALSO LOVE — cross-category
           ==================================================== */}
        {crossSellProducts.length > 0 && (
          <>
            <div className="cp-section-divider" />
            <section className="cp-crosssell panel-linen cp-fade-in">
              <div className="cp-crosssell-header">
                <span className="editorial-eyebrow">EXPLORE FURTHER</span>
                <h2 className="cp-crosssell-title">You May Also Love</h2>
                <p className="cp-crosssell-sub">From our other craft traditions</p>
              </div>
              <div className="cp-crosssell-row">
                {crossSellProducts.slice(0, 4).map(product => (
                  <div key={product.id} className="cp-crosssell-card">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ====================================================
             BESPOKE BANNER
           ==================================================== */}
        <div className="cp-section-divider" />

        <section className="cp-bespoke panel-espresso cp-fade-in">
          <span className="editorial-eyebrow" style={{ color: 'rgba(241,237,232,0.5)' }}>
            EXCLUSIVE ENGAGEMENTS
          </span>
          <h2 className="cp-bespoke-title">Commission a Bespoke Piece</h2>
          <p className="cp-bespoke-body">
            Work directly with our master weavers to create a textile designed
            around your space. Custom dimensions, colour palettes sourced from
            natural dyes, and delivery with a certificate of authenticity.
          </p>
          <button
            className="cta-link"
            style={{ color: 'var(--text-on-dark)', borderColor: 'rgba(241,237,232,0.5)', marginTop: '1rem' }}
            onClick={() => {
              const evt = new CustomEvent('open-bespoke');
              window.dispatchEvent(evt);
            }}
          >
            Inquire Custom Commission
          </button>
        </section>

      </main>
    </>
  );
}

/* ============================================================
   EXPORTED PAGE COMPONENT — wraps content in SiteShell
   ============================================================ */
export interface CategoryPageProps {
  products: ProductItem[];
  crossSellProducts: ProductItem[];
}

export default function CategoryPage(props: CategoryPageProps) {
  return (
    <SiteShell>
      <CategoryContent {...props} />
    </SiteShell>
  );
}
