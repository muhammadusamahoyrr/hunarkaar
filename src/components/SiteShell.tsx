'use client';

import React, {
  useState, useEffect, useRef, createContext, useContext,
  type Dispatch, type SetStateAction,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  NAV_MENUS, NAV_ITEMS,
  type ProductItem,
} from '@/lib/siteData';
import { useCart } from '@/lib/CartContext';

/* ============================================================
   CONTEXT — cart + ui actions available to child pages
   ============================================================ */
interface SiteContextType {
  addToCart: (p: ProductItem) => void;
  setQuickView: (p: ProductItem | null) => void;
  formatPrice: (usd: number, pkr: number) => string;
  currency: 'USD' | 'PKR';
  setCurrency: Dispatch<SetStateAction<'USD' | 'PKR'>>;
  cartCount: number;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
  /* Opens the commission modal, optionally pre-scoped to a craft. The craft
     must be one of the modal's <select> options or the prefill is a no-op. */
  openBespoke: (craft?: string) => void;
}

export const SiteContext = createContext<SiteContextType>({} as SiteContextType);
export const useSiteContext = () => useContext(SiteContext);

/* ============================================================
   SAFE IMAGE — fallback on error
   ============================================================ */
export function SafeImg({
  src, fallback, alt, className, style,
}: {
  src: string; fallback?: string; alt: string;
  className?: string; style?: React.CSSProperties;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  const applyFallback = () =>
    setImgSrc(fallback || `https://picsum.photos/seed/${alt.replace(/\s/g, '-')}/800/600`);

  /* An image that 404s while the server-rendered HTML is loading errors
     before React attaches onError, and the event never re-fires — the broken
     image just sits there. Catch that case on mount. */
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) applyFallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <img
      ref={imgRef}
      src={imgSrc} alt={alt} className={className} style={style} loading="lazy"
      onError={applyFallback}
    />
  );
}

/* ============================================================
   SITE SHELL — wraps every interior page
   ============================================================ */
interface SiteShellProps {
  children: React.ReactNode;
  /* Page-scope class (e.g. "page-bed"). Every route wraps its content in a
     div carrying this class so page-specific CSS overrides can be written as
     `.page-bed .cta-link { … }` and cannot leak into other pages that share
     the same global class. See CLAUDE.md → "Page-scoped styling". */
  scope?: string;
}

export default function SiteShell({ children, scope }: SiteShellProps) {
  /* ---------- cart (shared, persisted — see lib/CartContext) ---------- */
  const {
    cart, addToCart, removeFromCart, updateQty, cartCount,
    cartOpen, setCartOpen,
    currency, setCurrency, formatPrice, getSubtotal,
  } = useCart();

  /* ---------- state ---------- */
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const [activeMenu, setActiveMenu]           = useState<string | null>(null);
  const [menuClosing, setMenuClosing]         = useState(false);
  const [previewImg, setPreviewImg]           = useState('');
  const [previewVer, setPreviewVer]           = useState(0);
  const [searchOpen, setSearchOpen]           = useState(false);
  const [searchTerm, setSearchTerm]           = useState('');
  const [bespokeOpen, setBespokeOpen]         = useState(false);
  const [quickView, setQuickView]             = useState<ProductItem | null>(null);
  const [bespokeStep, setBespokeStep]         = useState(1);
  const [craftType, setCraftType]             = useState('Blue Pottery');
  const [dimensions, setDimensions]           = useState('');
  const [userName, setUserName]               = useState('');
  const [userEmail, setUserEmail]             = useState('');
  const [userWA, setUserWA]                   = useState('');

  const lenisRef     = useRef<Lenis | null>(null);
  const menuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------- lenis + header scroll ---------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.create({
      start: 'top -60',
      onUpdate: (self) => {
        const hdr = document.getElementById('site-header');
        if (!hdr) return;
        if (self.scroll() > 60) hdr.classList.add('scrolled');
        else hdr.classList.remove('scrolled');
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  /* ---------- escape to close all overlays ---------- */
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false); setSearchOpen(false);
        closeBespoke(); setQuickView(null);
        setMobileMenuOpen(false); setActiveMenu(null);
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);

  /* ---------- pause lenis when overlay open ---------- */
  useEffect(() => {
    if (!lenisRef.current) return;
    const anyOpen = cartOpen || searchOpen || bespokeOpen || !!quickView || mobileMenuOpen;
    if (anyOpen) { lenisRef.current.stop(); document.body.classList.add('no-scroll'); }
    else          { lenisRef.current.start(); document.body.classList.remove('no-scroll'); }
  }, [cartOpen, searchOpen, bespokeOpen, quickView, mobileMenuOpen]);

  /* ---------- force header scrolled when mobile menu open ---------- */
  useEffect(() => {
    const hdr = document.getElementById('site-header');
    if (!hdr) return;
    if (mobileMenuOpen) hdr.classList.add('scrolled');
    else if (typeof window !== 'undefined' && window.scrollY <= 60) hdr.classList.remove('scrolled');
  }, [mobileMenuOpen]);

  /* ---------- update preview image when active menu changes ---------- */
  useEffect(() => {
    if (activeMenu && NAV_MENUS[activeMenu]) {
      setPreviewImg(NAV_MENUS[activeMenu].portraitImg);
      setPreviewVer(v => v + 1);
    }
  }, [activeMenu]);

  /* ---------- menu helpers ---------- */
  const openMenu = (name: string) => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    menuTimerRef.current = setTimeout(() => {
      setActiveMenu(name); setMobileMenuOpen(false);
    }, 150);
  };
  const closeMenu = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setMenuClosing(true);
    menuTimerRef.current = setTimeout(() => { setActiveMenu(null); setMenuClosing(false); }, 150);
  };
  const scheduleClose = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    menuTimerRef.current = setTimeout(closeMenu, 140);
  };
  const cancelClose = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setMenuClosing(false);
  };

  /* ---------- bespoke helpers ---------- */
  const closeBespoke = () => {
    setBespokeOpen(false); setBespokeStep(1); setCraftType('Blue Pottery');
    setDimensions(''); setUserName(''); setUserEmail(''); setUserWA('');
  };
  const handleBespokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bespoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ craft: craftType, dimensions, userName, userEmail, userWhatsApp: userWA }),
      });
      const data = await res.json();
      if (data.success) {
        const msg = `Assalam-u-Alaikum! I placed a custom commission request via Hunarkar website.\n\nCraft: ${craftType}\nDetails: ${dimensions}\nName: ${userName}\nEmail: ${userEmail}`;
        window.open(`https://wa.me/923000000000?text=${encodeURIComponent(msg)}`, '_blank');
        closeBespoke();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    }
  };

  const openBespoke = (craft?: string) => {
    if (craft) setCraftType(craft);
    setBespokeOpen(true);
  };

  /* ---------- context value ---------- */
  const ctx: SiteContextType = {
    addToCart, setQuickView, formatPrice, currency, setCurrency, cartCount, setCartOpen,
    openBespoke,
  };

  /* ======================================================
     RENDER
     ====================================================== */
  return (
    <SiteContext.Provider value={ctx}>

      {/* ── HEADER ── */}
      <header id="site-header">
        <div className="header-top-bar">
          <div className="header-left">
            <button
              id="mobile-menu-btn"
              className={`header-icon-btn menu-toggle${mobileMenuOpen ? ' open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span className="hamburger-icon"><span /><span /><span /></span>
            </button>
            <button className="header-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>

          <div className="header-logo-wrap">
            <a href="/" className="logo" id="main-logo">H<em>unarkar</em></a>
          </div>

          <div className="header-right">
            <button className="header-interior-design" onClick={() => setBespokeOpen(true)}>
              Interior Design
            </button>
            <button
              className="header-icon-btn"
              onClick={() => alert('Profile and Membership settings panel coming soon!')}
              aria-label="User Account"
            >
              <i className="fa-regular fa-user" />
            </button>
            <div className="cart-icon-wrap">
              <button
                id="cart-open-btn"
                className="header-icon-btn"
                onClick={() => setCartOpen(true)}
                aria-label="Shopping bag"
              >
                <i className="fa-solid fa-bag-shopping" />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>

        <nav className="header-nav-bar" aria-label="Main navigation" onMouseLeave={scheduleClose}>
          {NAV_ITEMS.map(({ name, extraClass }) => (
            <button
              key={name}
              className={`nav-category-link${extraClass ? ` ${extraClass}` : ''}${activeMenu === name ? ' nav-active' : ''}`}
              onMouseEnter={() => openMenu(name)}
              onMouseLeave={scheduleClose}
              onClick={() => {
                const routeMap: Record<string, string> = {
                  'Bed': '/bed',
                  'Living': '/shop/living',
                  'Dining': '/dining',
                  'Textiles': '/textiles',
                  'Lighting': '/lighting'
                };
                if (routeMap[name]) {
                  closeMenu();
                  window.location.href = routeMap[name];
                } else {
                  activeMenu === name ? closeMenu() : openMenu(name);
                }
              }}
            >
              {name}
            </button>
          ))}
        </nav>
      </header>

      {/* ── MEGA MENU ── */}
      {activeMenu && NAV_MENUS[activeMenu] && (
        <>
          <div className="cat-backdrop" onClick={closeMenu} />
          <div
            className={`cat-dropdown${menuClosing ? ' closing' : ''}`}
            data-lenis-prevent
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="cat-inner">
              <div className="cat-links-col">
                <div className="cat-menu-heading">{activeMenu}</div>
                <a href={activeMenu === 'Living' ? '/shop/living' : `/${activeMenu.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="cat-shopall" onClick={closeMenu}>
                  Shop All {activeMenu}
                </a>
                <p className="cat-popular-label">{NAV_MENUS[activeMenu].popularLabel ?? 'Popular'}</p>
                {(() => {
                  let idx = 0;
                  return NAV_MENUS[activeMenu].sections.map((section, si) => (
                    <div key={si} className="cat-section">
                      {section.heading && <div className="cat-section-heading">{section.heading}</div>}
                      <ul className="cat-link-list">
                        {section.links.map((link) => {
                          const i = idx++;
                          return (
                            <li key={link.label} style={{ '--i': i } as React.CSSProperties}>
                              <a
                                href="#"
                                className="cat-link"
                                onClick={closeMenu}
                                onMouseEnter={() => {
                                  const src = link.img || NAV_MENUS[activeMenu!].portraitImg;
                                  setPreviewImg(src); setPreviewVer(v => v + 1);
                                }}
                                onMouseLeave={() => {
                                  setPreviewImg(NAV_MENUS[activeMenu!].portraitImg);
                                  setPreviewVer(v => v + 1);
                                }}
                              >
                                {link.label}
                                {link.isNew && <span className="cat-new-badge">NEW</span>}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ));
                })()}
              </div>

              <div className="cat-col-sep" />

              <div className="cat-editorial-cards">
                <div className="cat-ed-card">
                  <div className="cat-ed-img-wrap">
                    {previewImg && <img key={previewVer} src={previewImg} alt="" className="cat-preview-img" />}
                    <div className="cat-ed-overlay">
                      <span className="cat-ed-caption">{NAV_MENUS[activeMenu].caption1}</span>
                    </div>
                  </div>
                  <a href="#" className="cat-ed-link" onClick={closeMenu}>Shop the Edit →</a>
                </div>
                <div className="cat-ed-card">
                  <div className="cat-ed-img-wrap">
                    <img src={NAV_MENUS[activeMenu].editImg2} alt="" />
                    <div className="cat-ed-overlay">
                      <span className="cat-ed-caption">{NAV_MENUS[activeMenu].caption2}</span>
                    </div>
                  </div>
                  <a href="#" className="cat-ed-link" onClick={closeMenu}>Explore →</a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── HAMBURGER DROPDOWN BACKDROP ── */}
      {mobileMenuOpen && (
        <div className="ham-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ── HAMBURGER DROPDOWN — full-width 4-col panel ── */}
      <div className={`ham-dropdown${mobileMenuOpen ? ' open' : ''}`} data-lenis-prevent>
        <div className="ham-inner">
          {/* Col 1 — Products */}
          <div className="ham-col">
            <div className="ham-col-img-wrap">
              <img src="https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600&auto=format&fit=crop&q=80" alt="Our Products" />
            </div>
            <div className="ham-col-eyebrow">Our</div>
            <div className="ham-col-heading">Products</div>
            <a href="#" className="ham-col-shopall" onClick={() => setMobileMenuOpen(false)}>Shop All</a>
            <ul className="ham-col-links">
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Blue Pottery</a></li>
              <li><a href="/textiles" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Ajrak Textiles</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Woodcarving</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Khussa Footwear</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Brass & Onyx</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Ralli Quilts</a></li>
            </ul>
          </div>

          {/* Col 2 — Artisans */}
          <div className="ham-col">
            <div className="ham-col-img-wrap">
              <img src="https://images.unsplash.com/photo-1590605095243-072811dbe64c?w=600&auto=format&fit=crop&q=80" alt="Our Artisans" />
            </div>
            <div className="ham-col-eyebrow">Our</div>
            <div className="ham-col-heading">Artisans</div>
            <a href="#" className="ham-col-shopall" onClick={() => setMobileMenuOpen(false)}>Meet All Artisans</a>
            <ul className="ham-col-links">
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Sindhi Block Printers</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Lahori Woodcarvers</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Multani Potters</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Punjab Phulkari Makers</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Balochi Weavers</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Kashmiri Embroiderers</a></li>
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div className="ham-col">
            <div className="ham-col-img-wrap">
              <img src="/service.png" alt="Our Services" />
            </div>
            <div className="ham-col-eyebrow">Our</div>
            <div className="ham-col-heading">Services</div>
            <a href="#" className="ham-col-shopall" onClick={() => { setMobileMenuOpen(false); setBespokeOpen(true); }}>Start a Commission</a>
            <ul className="ham-col-links">
              <li><a href="#" className="ham-col-link" onClick={() => { setMobileMenuOpen(false); setBespokeOpen(true); }}>Bespoke Commissions</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Interior Styling</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Corporate Gifting</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Heritage Sourcing</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>White-Glove Delivery</a></li>
            </ul>
          </div>

          {/* Col 4 — Heritage */}
          <div className="ham-col">
            <div className="ham-col-img-wrap">
              <img src="https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&auto=format&fit=crop&q=80" alt="Our Heritage" />
            </div>
            <div className="ham-col-eyebrow">Our</div>
            <div className="ham-col-heading">Heritage</div>
            <a href="#" className="ham-col-shopall" onClick={() => setMobileMenuOpen(false)}>Explore Heritage</a>
            <ul className="ham-col-links">
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>400 Years of Craft</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Artisan Stories</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>The Hunarkar Journal</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Provenance & Process</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>About Us</a></li>
            </ul>
          </div>
        </div>

        {/* Footer bar */}
        <div className="ham-footer-bar">
          <a href="#" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Customer Experience</a>
          <a href="#" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Sign up for Emails</a>
          <a href="#" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Heritage Journal</a>
          <a href="https://wa.me/923000000000" target="_blank" rel="noreferrer" className="ham-footer-link">WhatsApp Us</a>
          <a href="#" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Privacy Notice</a>
          <a href="#" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Careers</a>
        </div>
      </div>

      {/* ── PAGE CONTENT ── */}
      <div className={`page-scope${scope ? ` ${scope}` : ''}`} data-page={scope}>
        {children}
      </div>

      {/* ── FOOTER ── */}
      <footer id="site-footer">
        <div className="footer-grid">
          <div>
            <a href="/" className="logo footer-logo">H<em>unarkar</em></a>
            <p className="footer-about-text">
              Preserving centuries-old heritage techniques by connecting Pakistan's
              master craftsmen directly with contemporary interiors worldwide.
            </p>
            <div className="social-links">
              <a href="https://instagram.com/hunarkaar" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="#" aria-label="Pinterest"><i className="fa-brands fa-pinterest" /></a>
              <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube" /></a>
              <a href="https://wa.me/923000000000" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="footer-col-title">Shop Collection</h4>
            <ul className="footer-links">
              <li><a href="/decor">Blue Pottery</a></li>
              <li><a href="/textiles">Indigo Ajrak</a></li>
              <li><a href="/textiles">Ralli Patchwork</a></li>
              <li><a href="/shop/living">Chinioti Woodwork</a></li>
              <li><a href="/lighting">Fine Brassware</a></li>
              <li><a href="/decor">Onyx Crafts</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">Heritage</h4>
            <ul className="footer-links">
              <li><a href="#">Meet the Maker</a></li>
              <li><a href="#">Our Process</a></li>
              <li><a href="#">Bespoke Orders</a></li>
              <li><a href="#">Impact & Fair Trade</a></li>
              <li><a href="#">Certificate of Authenticity</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">Aesthetic Newsletter</h4>
            <p className="newsletter-desc">
              Join our global circle for exclusive artisan profiles, collection drops, and heritage logs.
            </p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Welcome to the Hunarkar heritage circle.'); }}>
              <input type="email" placeholder="Your Email Address" className="newsletter-input" required />
              <button type="submit" className="btn-gold">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Hunarkar. All rights reserved. Created in Rawalpindi, Pakistan.</p>
          <div className="footer-badges">
            <span className="footer-badge">Global Shipping</span>
            <span className="footer-badge">Ethical Fair Trade</span>
            <span className="footer-badge">PKR + USD</span>
          </div>
        </div>
      </footer>

      {/* ── CART DRAWER ── */}
      {cartOpen && <div id="cart-overlay" onClick={() => setCartOpen(false)} />}
      <div id="cart-drawer" style={{ transform: cartOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div className="cart-header">
          <h3>Your Bag ({cartCount})</h3>
          <button className="close-btn" onClick={() => setCartOpen(false)}>Close <i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <p className="cart-empty-message">Your bag is empty.</p>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <SafeImg
                  className="cart-item-img"
                  src={item.img}
                  fallback={`https://picsum.photos/seed/${item.id}/160/200`}
                  alt={item.name}
                />
                <div className="cart-item-details">
                  <div>
                    <h4 className="cart-item-title">{item.name}</h4>
                    <div className="cart-item-price">{formatPrice(item.usdPrice, item.pkrPrice)}</div>
                    <div className="cart-qty-controls">
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-subtotal">
            <span className="cart-subtotal-label">Estimated Subtotal</span>
            <span className="cart-subtotal-val">{getSubtotal()}</span>
          </div>
          <button className="btn-gold" style={{ width: '100%' }} onClick={() => alert('Opening secure checkout...')}>
            Checkout Bag
          </button>
        </div>
      </div>

      {/* ── SEARCH OVERLAY ── */}
      <div id="search-overlay" className={searchOpen ? 'open' : ''}>
        <button id="search-close-btn" className="search-close" onClick={() => setSearchOpen(false)}>
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="search-input-wrap">
          <i className="fa-solid fa-magnifying-glass search-icon" />
          <input
            type="text"
            placeholder="Search the heritage catalogue..."
            className="search-input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { alert(`Searching for: "${searchTerm}"`); setSearchOpen(false); } }}
            autoFocus={searchOpen}
          />
        </div>
        <div className="search-suggestions">
          {['Ajrak Shawl', 'Cobalt Vase', 'Walnut Box', 'Khussa Shoes', 'Brass Tray'].map(s => (
            <span key={s} className="suggestion-tag" onClick={() => { setSearchTerm(s); alert(`Searching for: "${s}"`); setSearchOpen(false); }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* ── QUICK VIEW MODAL ── */}
      {quickView && (
        <div id="product-modal-overlay" onClick={() => setQuickView(null)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pm-close" onClick={() => setQuickView(null)} aria-label="Close">
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="pm-image-side">
              <SafeImg
                src={quickView.img}
                fallback={`https://picsum.photos/seed/${quickView.id}-modal/700/900`}
                alt={quickView.name}
              />
            </div>
            <div className="pm-details-side">
              <div>
                <span className="product-cat">{quickView.category}</span>
                <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', marginTop: '0.6rem' }}>
                  {quickView.name}
                </h2>
                <div className="product-price" style={{ fontSize: '1.1rem', color: 'var(--gold)', marginTop: '0.8rem' }}>
                  {formatPrice(quickView.usdPrice, quickView.pkrPrice)}
                </div>
                <div className="pm-cert-badge">
                  <i className="fa-solid fa-stamp" /> Certified Authentic Heritage Craft
                </div>
                <p className="pm-description">{quickView.description}</p>
                <div className="pm-artisan-card">
                  <span className="pm-artisan-label">Artisan Signature</span>
                  <p className="pm-artisan-text">"{quickView.artisan}"</p>
                </div>
              </div>
              <button
                className="btn-gold"
                style={{ width: '100%', marginTop: '2.5rem' }}
                onClick={() => { addToCart(quickView); setQuickView(null); }}
              >
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BESPOKE MODAL ── */}
      {bespokeOpen && (
        <div id="modal-overlay" onClick={closeBespoke}>
          <div id="bespoke-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bespoke Commission</h3>
              <button className="close-btn" onClick={closeBespoke}>Close <i className="fa-solid fa-xmark" /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleBespokeSubmit}>
                {bespokeStep === 1 && (
                  <div className="form-step active">
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)', marginBottom: '1.8rem' }}>
                      Select Craft Profile
                    </h4>
                    <div className="form-group">
                      <label>Heritage Artform</label>
                      <select className="form-select" value={craftType} onChange={(e) => setCraftType(e.target.value)}>
                        <option>Blue Pottery (Multani Floral Clay)</option>
                        <option>Indigo Ajrak Block Printing</option>
                        <option>Ralli Applique Stitch Quilt</option>
                        <option>Chiniot Walnut Woodcarving</option>
                        <option>Hammered Fine Brassware</option>
                        <option>Green/Gold Onyx Masonry</option>
                        {/* Leather, cane and khussa were missing, yet a third of
                            the catalogue is made in them. Commissioning a leather
                            artisan opened this form defaulted to Blue Pottery. */}
                        <option>Leather Weaving & Saddlery</option>
                        <option>Palm, Rattan & Cane</option>
                        <option>Zardozi Khussa</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Dimensions / Space Context</label>
                      <textarea
                        rows={3} className="form-textarea"
                        placeholder="e.g. 24×36 inch table top, custom oversized clay urn for living room..."
                        value={dimensions} onChange={(e) => setDimensions(e.target.value)} required
                      />
                    </div>
                  </div>
                )}
                {bespokeStep === 2 && (
                  <div className="form-step active">
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)', marginBottom: '1.8rem' }}>
                      Your Contact Info
                    </h4>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" className="form-input" placeholder="Your Name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" className="form-input" placeholder="your@email.com" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>WhatsApp Number</label>
                      <input type="text" className="form-input" placeholder="+92 300 1234567" value={userWA} onChange={(e) => setUserWA(e.target.value)} required />
                    </div>
                  </div>
                )}
                <div className="form-navigation">
                  {bespokeStep > 1
                    ? <button type="button" className="btn-outline" onClick={() => setBespokeStep(1)}>← Back</button>
                    : <div />}
                  {bespokeStep < 2
                    ? <button type="button" className="btn-gold" onClick={() => dimensions.trim() ? setBespokeStep(2) : alert('Please describe your project.')}>Next Step →</button>
                    : <button type="submit" className="btn-gold"><i className="fa-brands fa-whatsapp" /> Submit via WhatsApp</button>}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </SiteContext.Provider>
  );
}
