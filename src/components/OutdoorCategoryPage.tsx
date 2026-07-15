'use client';

/* ============================================================
   OUTDOOR COLLECTION — /outdoor

   Overhauled layout to match the clean, premium layout of
   /lighting: linen sections, espresso typography, subcategory
   tiles, filter bar, and a single product grid using standard
   ProductCard components.
   ============================================================ */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SiteShell, { useSiteContext, SafeImg } from './SiteShell';
import { ProductCard } from './CategoryPage';
import {
  LOCAL_OUTDOOR_PRODUCTS,
  OUTDOOR_BUNDLES,
  OutdoorProduct,
  BundleSet,
} from '@/lib/localOutdoorProducts';

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=80`;

const IMG_HERO   = U('photo-1600585154340-be6161a56a0c', 1800); // sunlit courtyard
const IMG_SHADOW = U('photo-1507473885765-e6ed057f782c', 1100); // warm copper light/fountain

/* ============================================================
   THE TRIAD — the outdoor designer's actual working spaces
   ============================================================ */
const TRIAD = [
  {
    term: 'Swings',
    img: U('photo-1595515106969-1ce29566ff1c', 700),
    body: 'The courtyard’s heartbeat — solid sheesham jhoolay and hand-knotted swings designed to anchor lazy afternoons.',
    cta: 'Shop swings & jhoolas',
    filter: 'Swing',
  },
  {
    term: 'Lounging',
    img: U('photo-1493809842364-78817add7ffb', 700),
    body: 'Garden comfort. Deep-seated PE wicker and teak sectionals engineered to weather the elements in style.',
    cta: 'Shop garden sofas',
    filter: 'Garden Sofa',
  },
  {
    term: 'Dining',
    img: U('photo-1601760562234-9814eea6663a', 700),
    body: 'Open-air gatherings. Premium sheesham dining sets and hand-woven rope chairs built for veranda dinners.',
    cta: 'Shop dining sets',
    filter: 'Dining',
  },
];

/* Subcategory tiles mapping */
const OUTDOOR_SUBCATS = [
  { id: 'All',         label: 'All Outdoor',      img: U('photo-1600585154340-be6161a56a0c', 400) },
  { id: 'Swing',       label: 'Swings & Jhoolas', img: U('photo-1595515106969-1ce29566ff1c', 400) },
  { id: 'Garden Sofa', label: 'Garden Sofas',     img: U('photo-1493809842364-78817add7ffb', 400) },
  { id: 'Dining',      label: 'Outdoor Dining',   img: U('photo-1601760562234-9814eea6663a', 400) },
  { id: 'Planters',    label: 'Planters & Pots',  img: U('photo-1416879595882-3373a0480b5b', 400) },
  { id: 'Fountain',    label: 'Fountains',        img: U('photo-1543258103-a62bdc069871', 400) },
];

const SORT_OPTIONS = ['Newest', 'Price ↑', 'Price ↓'];

interface OutdoorCategoryContentProps {
  products: OutdoorProduct[];
}

function OutdoorCategoryContent({ products }: OutdoorCategoryContentProps) {
  const { currency, setCurrency, addToCart, setCartOpen, openBespoke } = useSiteContext();
  const [activeSubcat, setActiveSubcat] = useState('All');
  const [activeSort, setActiveSort]     = useState('Newest');
  const gridRef = useRef<HTMLElement>(null);

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

  const filterAndGo = (filter: string) => {
    setActiveSubcat(filter);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      document.querySelectorAll('.cp-fade-in').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%' },
          }
        );
      });
      gsap.fromTo('.ot-triad-col',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power2.out',
          scrollTrigger: { trigger: '.ot-triad', start: 'top 78%' },
        }
      );
      gsap.fromTo('.cp-card',
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.cp-grid', start: 'top 80%' },
        }
      );
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 800);
    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(t);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    gsap.fromTo('.cp-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' }
    );
  }, [activeSubcat, activeSort]);

  const handleAddBundleToCart = (bundle: BundleSet) => {
    bundle.products.forEach(p => addToCart(p));
    setTimeout(() => setCartOpen(true), 200);
  };

  return (
    <div className="outdoor-container">
      {/* ── HERO ── */}
      <section className="cp-hero ot-hero">
        <img src={IMG_HERO} alt="Sunlit courtyard patio with dining set" className="cp-hero-bg" />
        <div className="cp-hero-overlay ot-hero-wash" />
        <div className="cp-hero-content">
          <span className="cp-hero-eyebrow">THE OUTDOOR EDIT</span>
          <h1 className="cp-hero-title">Live Outside</h1>
          <p className="cp-hero-tagline">
            Seasoned sheesham jhoolay, hand-thrown clay pots, and copper fountains.<br />
            Crafted for verandas and sunlit courtyards across Pakistan.
          </p>
        </div>
        <nav className="cp-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="cp-bc-sep">/</span>
          <span>Outdoor</span>
        </nav>
      </section>

      <main>
        {/* ── THE TRIAD: swings / lounging / dining ── */}
        <section className="ot-triad" aria-labelledby="ot-triad-h">
          <div className="ot-triad-head">
            <span className="ot-eyebrow">OUTDOOR SPACES</span>
            <h2 id="ot-triad-h" className="ot-triad-title">Three kinds of living</h2>
            <p className="ot-triad-sub">
              Every garden needs structure. Start with the zone yours is missing.
            </p>
          </div>
          <div className="ot-triad-row">
            {TRIAD.map(t => (
              <article className="ot-triad-col" key={t.term}>
                <div className="ot-triad-img">
                  <SafeImg src={t.img} fallback={IMG_HERO} alt="" />
                </div>
                <h3 className="ot-triad-term">{t.term}</h3>
                <p className="ot-triad-body">{t.body}</p>
                <button
                  type="button"
                  className="ot-triad-link"
                  onClick={() => filterAndGo(t.filter)}
                >
                  {t.cta}
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* ── Subcategory Tiles ── */}
        <section className="cp-sub-section panel-linen">
          <div className="cp-sub-row">
            {OUTDOOR_SUBCATS.map(sub => (
              <button
                key={sub.id}
                className={`cp-sub-tile${activeSubcat === sub.id ? ' active' : ''}`}
                onClick={() => setActiveSubcat(sub.id)}
              >
                <div className="cp-sub-img">
                  <SafeImg src={sub.img} fallback={IMG_HERO} alt={sub.label} />
                </div>
                <span className="cp-sub-label">{sub.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Filter Bar ── */}
        <div className="cp-filter-bar">
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

        {/* ── Product Grid ── */}
        <section ref={gridRef} id="ot-products" className="panel-linen" style={{ paddingBottom: '80px' }}>
          {displayProducts.length === 0 ? (
            <div className="cp-empty-state">
              <p>No pieces found in this selection.</p>
              <button className="cta-link" onClick={() => setActiveSubcat('All')}>
                View All Outdoor
              </button>
            </div>
          ) : (
            <div className="cp-grid">
              {displayProducts.map(product => (
                <ProductCard key={product.id} product={product as any} imgFallback={IMG_HERO} />
              ))}
            </div>
          )}
        </section>

        {/* ── BUILD YOUR SET (Bundles) ── */}
        <section className="outdoor-bundle-section cp-fade-in">
          <div className="outdoor-bundle-header">
            <span className="editorial-eyebrow">COORDINATED VERANDAS</span>
            <h2>Build Your Set</h2>
            <p>Carefully composed furniture packages — mix jhoolay, planters, and dining sets for a complete courtyard identity.</p>
          </div>
          <div className="outdoor-bundles-row">
            {OUTDOOR_BUNDLES.map(bundle => (
              <div key={bundle.id} className="outdoor-bundle-card">
                <div className="outdoor-bundle-info">
                  <h3>{bundle.name}</h3>
                  <p className="outdoor-bundle-desc">{bundle.description}</p>
                  <div className="outdoor-bundle-price-box">
                    <span className="bundle-price-label">Curated Set Value</span>
                    <span className="bundle-price-tag">
                      {currency === 'USD' ? `$${bundle.bundlePriceUsd}` : `PKR ${bundle.bundlePricePkr.toLocaleString()}`}
                    </span>
                    <span className="bundle-price-save">Save {currency === 'USD' ? '$100+' : 'PKR 28,000+'} on bundle</span>
                  </div>
                  <button type="button" className="outdoor-bundle-cta" onClick={() => handleAddBundleToCart(bundle)}>
                    Add Entire Set to Bag
                  </button>
                </div>
                <div className="outdoor-bundle-items-scroll">
                  {bundle.products.map((item, idx) => (
                    <div key={idx} className="outdoor-bundle-item-card">
                      <div className="outdoor-bundle-item-img"><img src={item.img} alt={item.name} /></div>
                      <div className="outdoor-bundle-item-details">
                        <h4>{item.name}</h4>
                        <span>{item.category}</span>
                        <p className="item-price">{currency === 'USD' ? `$${item.usdPrice}` : `PKR ${item.pkrPrice.toLocaleString()}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── EDITORIAL / CALL TO ACTION ── */}
        <div className="cp-section-divider" />
        <section className="ot-shadow panel-sandstone cp-fade-in">
          <div className="ot-shadow-img">
            <SafeImg src={IMG_SHADOW} alt="Courtyard fountain lighting" fallback={IMG_HERO} />
          </div>
          <div className="ot-shadow-content">
            <span className="editorial-eyebrow cp-ink-soft">THE GUILD TRADE</span>
            <h2 className="ot-shadow-title">Crafted for local skies</h2>
            <p className="ot-shadow-body">
              Every swing, planter, and copper fountain is built by hand in regional workshops across Pakistan. Seasoned sheesham, marine-grade oils, and UV-stabilised rattan ensure they age gracefully under the sun and rain.
            </p>
            <div className="ot-shadow-ctas">
              <Link href="/shop" className="cta-link cp-ink-cta">
                Browse Full Collection
              </Link>
              <button
                type="button"
                className="cta-link cp-ink-cta ot-shadow-commission"
                onClick={() => openBespoke('Bespoke Veranda Furniture')}
              >
                Commission Bespoke
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function OutdoorCategoryPage({ products }: { products: OutdoorProduct[] }) {
  return (
    <SiteShell scope="page-outdoor">
      <OutdoorCategoryContent products={products} />
    </SiteShell>
  );
}
