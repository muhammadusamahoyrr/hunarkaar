'use client';

/* ============================================================
   LIGHTING COLLECTION — /lighting

   Runs light, per the owner's direction: linen sections with
   espresso ink, warm daylight hero under a linen-wash scrim (the
   same light-scrim + espresso-type pattern as the homepage app
   banner). The glow lives in the photographs — the triad's task
   and accent images are lit lamps at night, framed by the light
   page rather than swimming in a dark one.

   The triad (ambient / task / accent) is the lighting designer's
   real working taxonomy; each column filters the grid. Everything
   else reuses the cp- card/tile/filter system so the shopping
   half reads as the same store as /textiles.
   ============================================================ */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SiteShell, { useSiteContext, SafeImg } from './SiteShell';
import { ProductCard } from './CategoryPage';
import type { ProductItem } from '@/lib/siteData';

/* ============================================================
   PAGE IMAGERY — every ID content-verified by eye in a browser.
   ============================================================ */
const U = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=80`;

const IMG_HERO    = U('photo-1519643381401-22c77e60520e', 1800); // warm daylight dining, pendant lit
const IMG_AMBIENT = U('photo-1519710164239-da123dc03ef4', 700); // soft, even daylight room
const IMG_TASK    = U('photo-1543198126-a8ad8e47fb22', 700);   // lamp burning over a night desk
const IMG_ACCENT  = U('photo-1507494924047-60b8ee826ca9', 700); // filaments strung through darkness
/* NB: 1550985616 is an electric guitar; it briefly shipped as the hero out
   of a mislabelled verification gallery. The glowing-pendants shot is
   1540932239986 — kept on the "All Lighting" tile below. */
const IMG_SHADOW  = U('photo-1618220179428-22790b461013', 1100); // lamplight washing a warm room

/* ============================================================
   THE TRIAD — the lighting designer's actual working taxonomy.
   These are terms of art, not marketing labels; each maps to a
   real filter on the grid below.
   ============================================================ */
const TRIAD = [
  {
    term: 'Ambient',
    img: IMG_AMBIENT,
    body: 'The room’s own dusk — soft, directionless light that sets the register of an evening.',
    cta: 'Shop pendants',
    filter: 'Pendant',
  },
  {
    term: 'Task',
    img: IMG_TASK,
    body: 'Light with a job. Focused and steady, wherever hands are working.',
    cta: 'Shop table lamps',
    filter: 'Table Lamp',
  },
  {
    term: 'Accent',
    img: IMG_ACCENT,
    body: 'The pointed exception — a glow that tells the eye where to look.',
    cta: 'Shop floor lamps & lanterns',
    filter: 'Floor Lamp',
  },
];

/* Type tiles reuse the textiles tile pattern (cp-sub-*). */
const LIGHT_SUBCATS = [
  { id: 'All',        label: 'All Lighting', img: U('photo-1540932239986-30128078f3c5', 400) },
  { id: 'Pendant',    label: 'Pendants',     img: U('photo-1565814329452-e1efa11c5b89', 400) },
  { id: 'Table Lamp', label: 'Table Lamps',  img: U('photo-1507473885765-e6ed057f782c', 400) },
  { id: 'Floor Lamp', label: 'Floor Lamps',  img: U('photo-1586023492125-27b2c045efd7', 400) },
  { id: 'Lantern',    label: 'Lanterns',     img: U('photo-1524484485831-a92ffc0de03f', 400) },
];

const SORT_OPTIONS = ['Newest', 'Price ↑', 'Price ↓'];

interface LightingContentProps {
  products: ProductItem[];
}

function LightingContent({ products }: LightingContentProps) {
  const { currency, setCurrency, openBespoke } = useSiteContext();
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

  /* Triad links both set the filter and travel to the grid. */
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
      gsap.fromTo('.lt-triad-col',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power2.out',
          scrollTrigger: { trigger: '.lt-triad', start: 'top 78%' },
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
    /* Trigger positions are computed at mount, before images size their
       sections; a late layout shift can leave a lower panel's trigger
       past its start with the panel still at opacity 0. Recompute once
       everything has settled. */
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

  return (
    <>
      {/* ── HERO: warm daylight under a linen wash — light scrim pairs
             with espresso type, per the homepage app-banner pattern. ── */}
      <section className="cp-hero lt-hero">
        <img src={IMG_HERO} alt="Pendant light over a warm dining room" className="cp-hero-bg" />
        <div className="cp-hero-overlay lt-hero-wash" />
        <div className="cp-hero-content">
          <span className="cp-hero-eyebrow">HAND-FORGED LIGHT</span>
          <h1 className="cp-hero-title">Lighting</h1>
          <p className="cp-hero-tagline">
            Beaten in Lahore, pierced in Rawalpindi —<br />
            lamps that print their maker’s pattern on the wall.
          </p>
        </div>
        <nav className="cp-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="cp-bc-sep">/</span>
          <span>Lighting</span>
        </nav>
      </section>

      <main>
        {/* ── THE TRIAD: ambient / task / accent ── */}
        <section className="lt-triad" aria-labelledby="lt-triad-h">
          <div className="lt-triad-head">
            <span className="lt-eyebrow">HOW LIGHT WORKS</span>
            <h2 id="lt-triad-h" className="lt-triad-title">Three kinds of light</h2>
            <p className="lt-triad-sub">
              Every room needs all three. Start with the one yours is missing.
            </p>
          </div>
          <div className="lt-triad-row">
            {TRIAD.map(t => (
              <article className="lt-triad-col" key={t.term}>
                <div className="lt-triad-img">
                  <SafeImg src={t.img} fallback={IMG_HERO} alt="" />
                </div>
                <h3 className="lt-triad-term">{t.term}</h3>
                <p className="lt-triad-body">{t.body}</p>
                <button
                  type="button"
                  className="lt-triad-link"
                  onClick={() => filterAndGo(t.filter)}
                >
                  {t.cta}
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* ── Day begins: type tiles (reuse cp-sub system) ── */}
        <section className="cp-sub-section panel-linen">
          <div className="cp-sub-row">
            {LIGHT_SUBCATS.map(sub => (
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

        {/* ── Filter bar (reuse cp-filter system) ── */}
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

        {/* ── Product grid ── */}
        <section ref={gridRef} id="lt-products" className="panel-linen" style={{ paddingBottom: '80px' }}>
          {displayProducts.length === 0 ? (
            <div className="cp-empty-state">
              <p>No pieces found in this selection.</p>
              <button className="cta-link" onClick={() => setActiveSubcat('All')}>
                View All Lighting
              </button>
            </div>
          ) : (
            <div className="cp-grid">
              {displayProducts.map(product => (
                <ProductCard key={product.id} product={product} imgFallback={IMG_HERO} />
              ))}
            </div>
          )}
        </section>

        {/* ── THE SHADOW IS THE SIGNATURE: maker + commission close ── */}
        <div className="cp-section-divider" />
        <section className="lt-shadow panel-sandstone cp-fade-in">
          <div className="lt-shadow-img">
            <SafeImg src={IMG_SHADOW} alt="Lamplight washing a room in warm pattern" fallback={IMG_HERO} />
          </div>
          <div className="lt-shadow-content">
            <span className="editorial-eyebrow cp-ink-soft">THE GUILD TRADE</span>
            <h2 className="lt-shadow-title">The shadow is the signature</h2>
            <p className="lt-shadow-body">
              A machine drills a thousand identical holes. A graver in a guildsman’s
              hand pierces a pattern he learned before he could write. Lit, a
              hand-pierced lantern does more than brighten a room — it prints its
              maker’s lineage on the walls.
            </p>
            <div className="lt-shadow-ctas">
              <Link href="/artisans/mohammad-din-brass" className="cta-link cp-ink-cta">
                Meet the Brass Guild
              </Link>
              <button
                type="button"
                className="cta-link cp-ink-cta lt-shadow-commission"
                onClick={() => openBespoke('Hammered Fine Brassware')}
              >
                Commission in Brass
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default function LightingPage(props: LightingContentProps) {
  return (
    <SiteShell>
      <LightingContent {...props} />
    </SiteShell>
  );
}
