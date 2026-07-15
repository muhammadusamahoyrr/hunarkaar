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

interface CategoryBlockProps {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  featureImg: string;
  reverse?: boolean;
  products: OutdoorProduct[];
  currency: 'USD' | 'PKR';
  onQuickView: (p: any) => void;
  onAddToCart: (p: any) => void;
}

const CategoryBlock = React.forwardRef<HTMLDivElement, CategoryBlockProps>(({
  id,
  label,
  eyebrow,
  description,
  featureImg,
  reverse = false,
  products,
  currency,
  onQuickView,
  onAddToCart,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const productRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const trigger = containerRef.current;
    const img = imgRef.current;
    if (!trigger || !img) return;

    // Smooth scroll-triggered scale effect (105% -> 100%) as the block enters viewport
    const anim = gsap.fromTo(img,
      { scale: 1.05 },
      {
        scale: 1.0,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          start: 'top bottom',
          end: 'center center',
          scrub: true,
        }
      }
    );

    return () => {
      anim.kill();
    };
  }, []);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    productRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <section id={id} ref={containerRef} className="ot-cat-block cp-fade-in">
      <div className={`ot-cat-block-row${reverse ? ' ot-row-reverse' : ''}`}>
        <div className="ot-cat-block-text">
          <span className="editorial-eyebrow ot-cat-eyebrow">{eyebrow}</span>
          <h2 className="ot-cat-title">{label}</h2>
          <p className="ot-cat-desc">{description}</p>
          <a href={`#${id}-products`} onClick={handleExploreClick} className="cta-link ot-cat-cta">
            Explore {label} →
          </a>
        </div>
        <div className="ot-cat-block-img-col">
          <div className="ot-cat-block-img-wrap">
            <img ref={imgRef} src={featureImg} alt={label} className="ot-cat-block-img" />
          </div>
        </div>
      </div>

      <div id={`${id}-products`} ref={productRowRef} className="ot-product-row-wrapper">
        <div className="ot-product-row">
          {products.map((product) => (
            <div key={product.id} className="ot-product-card-wrap">
              <ProductCard product={product as any} imgFallback={featureImg} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

CategoryBlock.displayName = 'CategoryBlock';

function OutdoorCategoryContent({ products }: OutdoorCategoryContentProps) {
  const { currency, setCurrency, addToCart, setCartOpen, setQuickView } = useSiteContext();
  const [activeSubcat, setActiveSubcat] = useState('All');

  const TABS = [
    { id: 'All',         label: 'All Outdoor',       sectionId: 'hero' },
    { id: 'Swing',       label: 'Jhoolas & Swings',  sectionId: 'swings' },
    { id: 'Garden Sofa', label: 'Garden Sofas',      sectionId: 'sofas' },
    { id: 'Dining',      label: 'Outdoor Dining',    sectionId: 'dining' },
    { id: 'Planters',    label: 'Planters & Pots',   sectionId: 'planters' },
    { id: 'Fountain',    label: 'Fountains',         sectionId: 'fountains' },
  ];

  const CATEGORY_SECTIONS = [
    {
      id: 'sofas',
      label: 'Garden Sofas',
      eyebrow: 'LUXURY LOUNGE',
      description: 'Deep-seated teak and all-weather wicker sectionals designed for open-air conversations.',
      featureImg: U('photo-clNTTnZOfwg', 900),
      filterTag: 'Garden Sofa',
    },
    {
      id: 'swings',
      label: 'Jhoolas & Swings',
      eyebrow: 'COURTYARD ANCHORS',
      description: 'Solid sheesham wood swing sets and hand-woven rattan egg chairs built for quiet verandas.',
      featureImg: U('photo-1595515106969-1ce29566ff1c', 900),
      filterTag: 'Swing',
    },
    {
      id: 'dining',
      label: 'Outdoor Dining Sets',
      eyebrow: 'AL FRESCO GATHERINGS',
      description: 'Weatherproof sheesham tables and hand-tensioned rope dining chairs.',
      featureImg: U('photo-1601760562234-9814eea6663a', 900),
      filterTag: 'Dining',
    },
    {
      id: 'planters',
      label: 'Planters & Clay Pots',
      eyebrow: 'HERITAGE CLAY',
      description: 'Cobalt-blue Multan glazed ceramic jars and Hala terracotta planters.',
      featureImg: U('photo-1416879595882-3373a0480b5b', 900),
      filterTag: 'Planters',
    },
    {
      id: 'fountains',
      label: 'Courtyard Fountains',
      eyebrow: 'SOUND & ILLUMINATION',
      description: 'Hand-beaten copper water bowls and architectural tiered fountains.',
      featureImg: U('photo-1543258103-a62bdc069871', 900),
      filterTag: 'Fountain',
    },
  ];

  const getCategoryProducts = (filterTag: string) => {
    return products.filter(p =>
      p.category.toLowerCase().includes(filterTag.toLowerCase()) ||
      p.name.toLowerCase().includes(filterTag.toLowerCase())
    );
  };

  const scrollToSection = (sectionId: string, tabId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSubcat('All');
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSubcat(tabId);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TABS.findIndex(t => t.id === activeSubcat);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    } else {
      return;
    }

    e.preventDefault();
    const nextTab = TABS[nextIndex];
    scrollToSection(nextTab.sectionId, nextTab.id);

    const buttons = e.currentTarget.querySelectorAll('button');
    const nextButton = buttons[nextIndex] as HTMLButtonElement;
    if (nextButton) {
      nextButton.focus();
    }
  };

  // Scrollspy to auto-select sticky quick-nav tabs on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observerOptions = {
      root: null,
      rootMargin: '-160px 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId === 'hero') {
            setActiveSubcat('All');
          } else {
            const correspondingTab = TABS.find(t => t.sectionId === sectionId);
            if (correspondingTab) {
              setActiveSubcat(correspondingTab.id);
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    CATEGORY_SECTIONS.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    const heroEl = document.getElementById('hero');
    if (heroEl) observer.observe(heroEl);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="outdoor-container">
      {/* ── HERO ── */}
      <section id="hero" className="cp-hero ot-hero">
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
        {/* ── STICKY QUICK-NAV FILTER BAR ── */}
        <div className="ot-quick-nav-wrapper">
          <div
            className="ot-quick-nav"
            role="tablist"
            aria-label="Outdoor collection subcategories"
            onKeyDown={handleKeyDown}
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeSubcat === tab.id}
                tabIndex={activeSubcat === tab.id ? 0 : -1}
                className={`ot-quick-nav-btn${activeSubcat === tab.id ? ' active' : ''}`}
                onClick={() => scrollToSection(tab.sectionId, tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CATEGORY BLOCKS LIST ── */}
        <div className="ot-blocks-container">
          {CATEGORY_SECTIONS.map((sec, idx) => {
            const catProducts = getCategoryProducts(sec.filterTag);
            return (
              <div key={sec.id} className="ot-cat-block-container">
                <CategoryBlock
                  id={sec.id}
                  label={sec.label}
                  eyebrow={sec.eyebrow}
                  description={sec.description}
                  featureImg={sec.featureImg}
                  reverse={idx % 2 === 1}
                  products={catProducts}
                  currency={currency}
                  onQuickView={setQuickView}
                  onAddToCart={addToCart}
                />
              </div>
            );
          })}
        </div>
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
