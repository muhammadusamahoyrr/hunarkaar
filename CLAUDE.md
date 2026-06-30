@AGENTS.md

---

# Hunarkar — Project Brief

## What is this?
**Hunarkar** is a luxury Pakistani artisan e-commerce homepage. The design is modelled 1:1 after [RH.com](https://rh.com/us/en/) (Restoration Hardware) — editorial, cinematic, full-width stacked panels — but themed for Pakistani handmade crafts (pottery, textiles, woodwork, brass, onyx, khussa).

## Tech Stack
- **Next.js** (App Router, see AGENTS.md — this version has breaking changes)
- **TypeScript**
- **Turbopack** dev server
- **GSAP + ScrollTrigger** — scroll animations (fade-in, no parallax)
- **Lenis** — smooth scroll (`data-lenis-prevent` on any scrollable overlay)
- **MongoDB + Mongoose** — product data, seeded via `/api/products`
- **Font Awesome** — icons in the header (hamburger, search, user, bag)

## Fonts
- **Cormorant Garamond** (`var(--font-display)`) — all display headings, editorial text
- **Jost** (`var(--font-body)`) — nav, labels, body copy

## Colour Palette
| Token | Value | Usage |
|---|---|---|
| `--bg-light` | `#f1ede8` | Linen/parchment — default section bg |
| `--bg-warm` | `#b5a08a` | Taupe/sandstone — alternating sections |
| `--bg-dark` | `#1a1512` | Deep espresso — dark sections |
| `--text-primary` | `#2c2520` | Near-black on light backgrounds |
| `--text-on-dark` | `#f1ede8` | Cream on dark backgrounds |
| `--text-secondary` | `#8a7d72` | Muted stone |
| `--gold` | `#b8935a` | Only on logo accent + special links |
| `--border` | `rgba(0,0,0,0.08)` | Hairline dividers |

## Key Design Rules (from design.md)
- **No filled buttons anywhere** — all CTAs are underlined text links
- **No rounded corners** — everything is sharp rectangles (exception: mega-menu column images have `border-radius: 4px`)
- **No parallax** — sections fade in with `opacity 0→1, y 30→0`
- **No marquee/ticker** — removed per RH design
- **No accent colour overuse** — gold only on logo + "Best sellers" link
- **Section backgrounds alternate**: linen → taupe → espresso → linen
- **Hairline 1px dividers** between sections

## File Structure
```
src/
  app/
    globals.css       ← ALL styles live here
    page.tsx          ← Server component, fetches products, renders <Homepage>
  components/
    Homepage.tsx      ← Entire client-side UI (single large component)
  models/
    Product.ts        ← Mongoose schema
  lib/
    mongodb.ts        ← DB connection
public/
  hk1.png, hk2.png, hk3.avif   ← Hero lifestyle images
  service.png                    ← Services mega-menu image
  (product images as folders)
design.md             ← Full RH-inspired design system spec (READ THIS)
```

## Homepage Section Order
1. **Header** — 2-row RH-style: top bar (hamburger, logo, Interior Design, icons) + nav bar (13 categories)
2. **Mega Menu** — dropdown from `top: 106px`, 4 columns (Products / Artisans / Services / Heritage), each with a top editorial image
3. **Hero** — full-viewport, 3-image crossfade slideshow
4. **Editorial Manifesto** — 2-col split: catalog image left, text right (linen bg)
5. **Founder Panel** — portrait + mission statement (taupe bg)
6. **Craft Feature** — 2-col product close-up (dark bg)
7. **Finish Grid** — 3×2 swatch grid
8. **Room Scene** — full-width lifestyle image, no text
9. **Bespoke Banner** — full-width CTA section
10. **New Arrivals Grid** — 4-column product cards
11. **Instagram Section**
12. **Footer**

## Header Details
- **Top bar** (`height: 60px`, `padding: 0 3rem`): hamburger (left-aligned to match Estates below) | centred logo | "Interior Design" text link + user icon + cart icon
- **Nav bar** (`height: 46px`, `padding: 0 3rem`, `justify-content: space-between`): Estates · Living · Dining · Bed · Bath · Outdoor · Lighting · Textiles · Rugs · Décor · Baby & Child · Teen · **SALE** (red)
- Total header height: **106px** (60 + 46)
- Transparent over hero, fades to linen `rgba(241,237,232,0.96)` on scroll or hover

## Mega Menu
- `position: fixed; top: 106px; z-index: 850` — slides down from below both header rows
- Backdrop: `position: fixed; top: 106px; z-index: 840; background: rgba(26,21,18,0.4)`
- 4 columns: **Our Products** / **Our Artisans** / **Our Services** / **Our Heritage**
- Each column has: editorial image at top (170px, `border-radius: 4px`, bottom+top gradient fade) → "Our" eyebrow → bold heading → 2 sub-sections with links
- Column images (Unsplash free CDN):
  - Products: `photo-1564078516393` (luxury interior)
  - Artisans: `photo-1590605095243` (hands at pottery wheel)
  - Services: `/service.png` (local)
  - Heritage: `photo-1693141520831` (Pakistani culture)
- Footer bar: Customer Experience · Sign up for Emails · Heritage Journal · WhatsApp Us · Privacy Notice · Careers
- Opens via hamburger click (`mobileMenuOpen` state); header forced to `scrolled` class when open

## State Variables (Homepage.tsx)
| State | Type | Purpose |
|---|---|---|
| `products` | `ProductItem[]` | All products from DB |
| `cart` | `CartItem[]` | Cart items |
| `currency` | `'USD' \| 'PKR'` | Display currency |
| `cartOpen` | `boolean` | Cart sidebar |
| `mobileMenuOpen` | `boolean` | Mega menu open/close |
| `searchOpen` | `boolean` | Search overlay |
| `bespokeOpen` | `boolean` | Bespoke commission modal |
| `quickView` | `ProductItem \| null` | Quick view modal |
| `heroSlide` | `0 \| 1 \| 2` | Hero image crossfade index |

## Important CSS Classes
- `.cta-link` — underlined text link (all CTAs use this, no buttons)
- `.editorial-panel` — full-width stacked section wrapper
- `.panel-linen` / `.panel-warm` / `.panel-dark` — background alternators
- `.mega-col-img-wrap` — image container in mega-menu columns (170px, border-radius 4px, top+bottom gradient fade, hover zoom)
- `.nav-category-link` — header nav items (0.85rem, uppercase, tracked)
- `.mega-col-heading` — "Products" / "Artisans" etc (1.5rem, weight 500)
- `.nav-sale` — red `#c0392b` for the Sale link

## What Has Been Completed
- [x] RH-style 2-row header
- [x] Mega menu dropdown (4 columns with per-column images)
- [x] Hero with 3-image crossfade
- [x] All editorial content sections
- [x] Cart sidebar
- [x] Bespoke commission modal (multi-step)
- [x] Quick view modal
- [x] Search overlay
- [x] New arrivals product grid
- [x] Footer
- [x] Lenis smooth scroll + GSAP fade-in animations

## Still To Do / Known Issues
- Nav category links (Estates, Living, etc.) are all `href="#new-arrivals"` — need real category pages
- No actual checkout / payment flow
- Mobile nav (hamburger shows mega-menu on desktop; mobile gets a separate full-screen menu at ≤1100px breakpoint — currently the mega-menu itself is used but may need refinement)
