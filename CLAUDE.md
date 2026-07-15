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
  - Use the canonical `.hp-section-heading` class for section `<h2>`s rather than
    restyling per section. Four landing-page headings had drifted to **Jost 700 at
    -0.5px** — a heavy geometric sans — and read as a different site bolted on.
  - **Serifs want tracking OPEN (+0.02em), never tightened.** The negative
    letter-spacing that flatters a geometric sans strangles a high-contrast serif.
  - **Weight is what makes a display serif feel cheap.** The h1 was Cormorant 700;
    at 58px+ the right register is **300**. Section h2s sit at 400 — bumped to 500
    only on the sandstone panels, where a thin serif stroke goes weak on a mid-tone.
  - The masked reveal (`[data-split]`) clips descenders if `.sr-word`'s
    padding/margin pair is reduced — Cormorant's tails are deeper than Jost's.
  - **Approved exception — the two commercial panels.** `.hp-transform-title` and
    `.hp-sale-title` are **Jost light in wide-tracked caps** (0.09–0.1em), not
    Cormorant. User-requested: the promo panels get a contemporary voice against
    the editorial serif everywhere else. Do not "fix" them back to the serif.
    - Weight is **400 on the sandstone panel, 300 on linen** — a 300 geometric
      stroke goes weak against a mid-tone.
    - Caps + open tracking runs WIDE. The Transform text column is only ~44% of
      the panel, so its size sits well below the mixed-case scale. If you enlarge
      it, re-check that "TRANSFORM" still fits at 390px.
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
  - **Approved exception — hero scale + dim.** The hero media scrubs `scale 1 → 1.14`
    with a `.hero-dim` scrim fading `0 → 0.72` as it scrolls out. This is a
    scale/opacity pair, not a layer-speed differential, so the hero never
    detaches from the scroll. Do not "fix" this by removing it.
  - Scroll reveals otherwise use the page's **clip-path curtain wipe** language
    (`[data-wipe]`, product cards) and **masked word reveals** (`[data-split]`).
- **No marquee/ticker** — removed per RH design
  - **Approved exception — Shop by Category.** The category circles are now a
    continuous full-bleed marquee (`.hp-cat-marquee`), 12 categories, drifting
    left at 48s/loop. User-requested; do not "fix" it back to a static grid.
  - Two things it depends on, which are easy to break:
    - **Spacing is `margin-right` on each item, never a track `gap`.** With `gap`
      the two copies are not exactly half the track each (one extra gap sits
      between them), so `translateX(-50%)` misses the seam and the loop jumps
      every cycle.
    - **Full-bleed uses `100vw - var(--sbw)`, not `100vw`.** `--sbw` is the real
      scrollbar width, measured in a `useEffect` in Homepage.tsx. Plain `100vw`
      counts the scrollbar gutter and gives the whole page a horizontal scrollbar.
  - It pauses on `:hover` and `:focus-within` — a moving target you cannot click
    is hostile. The duplicated half is `aria-hidden` + `tabIndex={-1}`.
- **No accent colour overuse** — gold only on logo + "Best sellers" link
- **Section backgrounds alternate**: linen → taupe → espresso → linen
  - **Landing page runs light.** The "Transform Your Home" and "Download The App"
    panels were espresso (`#1a1512` / `#2A2018`) and read as dark holes punched
    through the soft linen page. Both are now `--bg-warm` sandstone with espresso
    type. Espresso is reserved for the footer, which closes the page.
  - "Download The App" is a photo banner: its scrim is a **light linen wash**
    (`rgba(241,237,232,0.78)`), not a dark one. If you ever flip its text back to
    cream, the scrim has to flip with it or the copy is unreadable over the photo.
  - Body copy on sandstone needs `rgba(26,21,18,0.85)` or darker — `0.72` measures
    4.29:1 and fails the 4.5:1 WCAG AA floor.
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

## Page-scoped styling — WHY EDITS "LEAK" BETWEEN PAGES
All CSS lives in the single `globals.css` and loads on **every** page, so
editing a shared class (`.cta-link`, `.panel-linen`, `.hp-section-heading`, …)
silently restyles every page that uses it. To prevent this, each route wraps
its content in `<div class="page-scope page-XXX">`:
- **SiteShell pages** pass a `scope` prop — e.g. `<SiteShell scope="page-bed">`.
  Scopes: `page-textiles` (CategoryPage), `page-bed`, `page-outdoor`,
  `page-lighting`, `page-rooms`, `page-artisan`, `page-product`.
- **Homepage** and **ShopPage** have their own shells and add the wrapper
  inline: `page-home`, and `page-shop` (+ `page-shop-living` / `page-shop-dining`).

**Rule: to restyle a shared class on ONE page, never edit the shared rule —
add a scoped override**, e.g. `.page-bed .cta-link { … }`. Before editing any
class in `globals.css`, grep how many pages use it. The `.page-scope` wrapper
is a plain block box with no layout of its own — do not give it padding,
margin, transform, or overflow, or full-bleed sections will break.

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
