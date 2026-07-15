'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SiteShell, { useSiteContext, SafeImg } from './SiteShell';
import { artisanSlugFor } from '@/lib/artisans';
import type { ProductItem } from '@/lib/siteData';

/* ============================================================
   PAGE IMAGERY — every ID here is verified to resolve (the old
   intro image 404'd and left half the section as a white void).
   Each image appears once, except the "All Textiles" tile, which
   deliberately echoes the hero. picsum.photos is not reachable
   from every network, so product-card fallback uses IMG_HERO too.
   ============================================================ */
const U = (id: string, w = 700) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=80`;

const IMG_HERO     = U('photo-1779470703519-05af825e87cd', 1800); // textile pile
const IMG_INTRO    = U('photo-1773842298512-e49c9331cc3d', 900);  // artisan's hands at the loom
const IMG_BREAK    = U('photo-1558769132-cb1aea458c5e', 1800);    // draped garments
/* Same photograph that fronts her dossier at /artisans/mai-bakhtawar —
   one image, one identity. Do not let the two drift apart. */
const IMG_PORTRAIT = U('photo-1610030469983-98e550d6193c', 700);  // woman in handwoven sari

/* ============================================================
   SUBCATEGORY TILE DATA
   "All" deliberately echoes the hero; "Shawls" reuses the break
   image at tile crop — the pool of content-verified textile
   photography is small, and those two were the least-wrong reuses.
   ============================================================ */
const TEXTILES_SUBCATS = [
  { id: 'All',      label: 'All Textiles', img: U('photo-1779470703519-05af825e87cd', 400) },
  { id: 'Ajrak',    label: 'Ajrak',        img: U('photo-1600166898405-da9535204843', 400) },
  { id: 'Ralli',    label: 'Ralli Quilts', img: U('photo-1505693416388-ac5ce068fe85', 400) },
  { id: 'Shawl',    label: 'Shawls',       img: U('photo-1558769132-cb1aea458c5e', 400) },
  { id: 'Phulkari', label: 'Phulkari',     img: U('photo-1594040226829-7f251ab46d80', 400) },
];

const SORT_OPTIONS = ['Newest', 'Price ↑', 'Price ↓'];

/* ============================================================
   PRODUCT CARD — editorial, on-system: no radius, no filled
   buttons. The image and name link to the PDP (the old card had
   no route to the product page at all — quick view only). The
   hover strip is a sibling of the image link, not a child, so
   its buttons are never nested inside an <a>.
   ============================================================ */
export function ProductCard({
  product, imgFallback = IMG_HERO,
}: { product: ProductItem; imgFallback?: string }) {
  const { addToCart, setQuickView, formatPrice } = useSiteContext();
  const makerName = product.artisan.split(',')[0];
  const makerSlug = artisanSlugFor(product.artisan);

  return (
    <div className="cp-card">
      <div className="cp-card-img-wrap">
        <Link
          href={`/shop/product/${product.id}`}
          className="cp-card-img-link"
          aria-label={product.name}
        >
          <SafeImg
            src={product.img}
            fallback={imgFallback}
            alt={product.name}
            className="cp-card-img"
          />
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
            <button
              type="button"
              className="cp-strip-link"
              onClick={() => setQuickView(product)}
            >
              Quick View
            </button>
            <span className="cp-strip-sep" aria-hidden="true" />
            <button
              type="button"
              className="cp-strip-link"
              onClick={() => addToCart(product)}
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
      <div className="cp-card-info">
        <p className="cp-card-cat">{product.category}</p>
        <h3 className="cp-card-name">
          <Link href={`/shop/product/${product.id}`}>{product.name}</Link>
        </h3>
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
  const { currency, setCurrency, openBespoke } = useSiteContext();
  const [activeSubcat, setActiveSubcat] = useState('All');
  const [activeSort, setActiveSort]     = useState('Newest');
  const filterBarRef = useRef<HTMLDivElement>(null);

  /* ---- Subcategory scroller (snap + arrows + drag) ---- */
  const subcatRef = useRef<HTMLDivElement>(null);
  const [subcatNav, setSubcatNav] = useState({ left: false, right: false });
  const dragState = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  const updateSubcatNav = useCallback(() => {
    const el = subcatRef.current;
    if (!el) return;
    const canScrollLeft = el.scrollLeft > 2;
    const canScrollRight = el.scrollLeft < (el.scrollWidth - el.clientWidth - 2);
    setSubcatNav({ left: canScrollLeft, right: canScrollRight });
  }, []);

  useEffect(() => {
    const el = subcatRef.current;
    if (!el) return;
    updateSubcatNav();
    window.addEventListener('resize', updateSubcatNav);
    return () => window.removeEventListener('resize', updateSubcatNav);
  }, [updateSubcatNav, activeSubcat]);

  const scrollSubcat = (direction: number) => {
    const el = subcatRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6 * direction;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const onSubcatDown = (e: React.PointerEvent) => {
    const el = subcatRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    dragState.current = {
      down: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
  };
  const onSubcatMove = (e: React.PointerEvent) => {
    if (!dragState.current.down) return;
    const el = subcatRef.current;
    if (!el) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 4) dragState.current.moved = true;
    el.scrollLeft = dragState.current.startScroll - dx;
  };
  const onSubcatUp = (e: React.PointerEvent) => {
    if (!dragState.current.down) return;
    const el = subcatRef.current;
    if (el) el.releasePointerCapture(e.pointerId);
    dragState.current.down = false;
  };

  /* Honest ledger figures — the old block hardcoded "8 artisans" and
     fell back to a fictional 32 pieces. */
  const artisanCount = new Set(products.map(p => p.artisan)).size;

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
          src={IMG_HERO}
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
          <Link href="/">Home</Link>
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
            {/* The previous image ID returned 404 and rendered this whole
                column as a white void. Only verified IDs on this page. */}
            <img
              src={IMG_INTRO}
              alt="Weaver's hands at the loom — Sindh textile workshop"
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
                <span className="cp-stat-num">{products.length}</span>
                <span className="cp-stat-label">{products.length === 1 ? 'Piece' : 'Pieces'}</span>
              </div>
              <div className="cp-stat-sep" />
              <div className="cp-stat">
                <span className="cp-stat-num">{artisanCount}</span>
                <span className="cp-stat-label">{artisanCount === 1 ? 'Artisan' : 'Artisans'}</span>
              </div>
              <div className="cp-stat-sep" />
              <div className="cp-stat">
                <span className="cp-stat-num">400</span>
                <span className="cp-stat-label">Years of Craft</span>
              </div>
            </div>
            <div className="cp-intro-ctas">
              {/* The old pair were dead buttons; one real destination
                  beats two that go nowhere. */}
              <a href="#cp-products" className="cta-link">Shop the Collection</a>
            </div>
          </div>
        </section>

        {/* ====================================================
             SUBCATEGORY TILES
           ==================================================== */}
        <div className="cp-section-divider" />

        <section className="cp-sub-section panel-linen">
          <div className={`shop-subcat-wrap${subcatNav.left ? ' fade-left' : ''}${subcatNav.right ? ' fade-right' : ''}`} style={{ border: 'none' }}>
            <button
              className={`shop-subcat-arrow left${subcatNav.left ? ' show' : ''}`}
              onClick={() => scrollSubcat(-1)}
              aria-label="Scroll categories left"
              tabIndex={subcatNav.left ? 0 : -1}
              style={{ top: '69px' }}
            >
              <i className="fa-solid fa-chevron-left" />
            </button>

            <div
              className="cp-sub-row"
              ref={subcatRef}
              onScroll={updateSubcatNav}
              onPointerDown={onSubcatDown}
              onPointerMove={onSubcatMove}
              onPointerUp={onSubcatUp}
              onPointerLeave={onSubcatUp}
              style={{ scrollBehavior: 'smooth', cursor: 'grab', touchAction: 'pan-x' }}
            >
              {TEXTILES_SUBCATS.map(sub => (
                <button
                  key={sub.id}
                  className={`cp-sub-tile${activeSubcat === sub.id ? ' active' : ''}`}
                  onClick={() => {
                    if (dragState.current.moved) { dragState.current.moved = false; return; }
                    setActiveSubcat(sub.id);
                  }}
                >
                  <div className="cp-sub-img">
                    <img src={sub.img} alt={sub.label} draggable={false} />
                  </div>
                  <span className="cp-sub-label">{sub.label}</span>
                </button>
              ))}
            </div>

            <button
              className={`shop-subcat-arrow right${subcatNav.right ? ' show' : ''}`}
              onClick={() => scrollSubcat(1)}
              aria-label="Scroll categories right"
              tabIndex={subcatNav.right ? 0 : -1}
              style={{ top: '69px' }}
            >
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
        </section>

        {/* ====================================================
             STICKY FILTER BAR
           ==================================================== */}
        <div className="cp-filter-bar" ref={filterBarRef}>
          <div className="cp-filter-left">
            <span className="cp-filter-label">Sort:</span>
            <div className="cp-sort-switch">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  className={`cp-sort-pill${activeSort === opt ? ' active' : ''}`}
                  onClick={() => setActiveSort(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="cp-filter-right">
            <span className="cp-filter-count">
              {displayProducts.length} {displayProducts.length === 1 ? 'piece' : 'pieces'}
              {activeSubcat !== 'All' && ` — ${activeSubcat}`}
            </span>
            <div className="cp-currency-switch">
              {(['USD', 'PKR'] as const).map(curr => (
                <button
                  key={curr}
                  type="button"
                  className={`cp-currency-pill${currency === curr ? ' active' : ''}`}
                  onClick={() => setCurrency(curr)}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ====================================================
             PRODUCT GRID
           ==================================================== */}
        <section id="cp-products" className="panel-linen" style={{ paddingBottom: '80px' }}>
          {displayProducts.length === 0 ? (
            <div className="cp-empty-state">
              <p>No pieces found in this selection.</p>
              <button className="cta-link" onClick={() => setActiveSubcat('All')}>
                View All Textiles
              </button>
            </div>
          ) : (
            <div className="cp-grid">
              {displayProducts.map((product, idx) => (
                <React.Fragment key={product.id}>
                  {idx === 4 && (
                    <div className="cp-grid-editorial-card">
                      <img
                        src={IMG_BREAK}
                        alt="Hand-finished garments in the studio"
                        className="cp-grid-editorial-img"
                      />
                      <div className="cp-grid-editorial-overlay">
                        <span className="cp-grid-editorial-text">
                          "Every stitch is a word.<br />Every panel, a sentence."
                        </span>
                        <span className="cp-grid-editorial-attr">— The Phulkari Tradition, Punjab</span>
                      </div>
                    </div>
                  )}
                  <ProductCard product={product} />
                </React.Fragment>
              ))}
              {displayProducts.length <= 4 && (
                <div className="cp-grid-editorial-card">
                  <img
                    src={IMG_BREAK}
                    alt="Hand-finished garments in the studio"
                    className="cp-grid-editorial-img"
                  />
                  <div className="cp-grid-editorial-overlay">
                    <span className="cp-grid-editorial-text">
                      "Every stitch is a word.<br />Every panel, a sentence."
                    </span>
                    <span className="cp-grid-editorial-attr">— The Phulkari Tradition, Punjab</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ====================================================
             ARTISAN SPOTLIGHT
           ==================================================== */}
        <div className="cp-section-divider" />

        {/* Espresso ink on the sandstone panel — the old cream text measured
            ~1.9:1 against #b5a08a. The portrait had shown a potter's hands;
            Mai Bakhtawar is a block-printer, and this image is the one that
            fronts her dossier. Both CTAs were dead buttons; her dossier page
            is real, so the section now leads there. */}
        <section className="cp-artisan panel-sandstone cp-fade-in">
          <div className="cp-artisan-portrait">
            <img
              src={IMG_PORTRAIT}
              alt="Mai Bakhtawar in handwoven silk — Bhit Shah, Sindh"
            />
          </div>
          <div className="cp-artisan-content">
            <span className="editorial-eyebrow cp-ink-soft">THE MAKER</span>
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
              <Link href="/artisans/mai-bakhtawar" className="cta-link cp-ink-cta">
                Read Her Dossier
              </Link>
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

        {/* Sandstone, not espresso: the page used to end with two stacked
            espresso blocks (this + the footer) — the "dark hole" pattern the
            homepage already corrected. Espresso closes the page via the
            footer alone. The old CTA dispatched an 'open-bespoke' event that
            had no listener anywhere; it now opens the real commission modal,
            pre-scoped to the craft this page sells. */}
        <section className="cp-bespoke panel-sandstone cp-fade-in">
          <span className="editorial-eyebrow cp-ink-soft">
            EXCLUSIVE ENGAGEMENTS
          </span>
          <h2 className="cp-bespoke-title">Commission a Bespoke Piece</h2>
          <p className="cp-bespoke-body">
            Work directly with our master weavers to create a textile designed
            around your space. Custom dimensions, colour palettes sourced from
            natural dyes, and delivery with a certificate of authenticity.
          </p>
          <button
            type="button"
            className="cta-link cp-ink-cta cp-bespoke-cta"
            onClick={() => openBespoke('Indigo Ajrak Block Printing')}
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
    <SiteShell scope="page-textiles">
      <CategoryContent {...props} />
    </SiteShell>
  );
}
