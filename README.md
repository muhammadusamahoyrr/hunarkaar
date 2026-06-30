# Hunarkar — Luxury Pakistani Artisan E-Commerce

An editorial, cinematic e-commerce homepage for Pakistani handmade crafts — pottery, textiles, woodwork, brass, onyx, khussa. Designed 1:1 after the RH (Restoration Hardware) aesthetic: full-width stacked panels, no filled buttons, no rounded corners, alternating dark/linen/taupe section backgrounds.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Dev Server | Turbopack |
| Styling | Tailwind CSS + custom CSS variables in `globals.css` |
| Animations | GSAP + ScrollTrigger (fade-in on scroll) |
| Smooth Scroll | Lenis |
| Database | MongoDB + Mongoose |
| Icons | Font Awesome 6 |
| Fonts | Cormorant Garamond (display) · Jost (body) — via Google Fonts |

---

## Key Features

- **RH-style 2-row header** — transparent over hero, scrolls to linen
- **Mega menu** — 4-column dropdown (Products / Artisans / Services / Heritage) with editorial images
- **Hero** — full-viewport 3-image crossfade slideshow
- **Editorial sections** — Manifesto, Founder Panel, Craft Feature, Finish Grid, Room Scene, Bespoke Banner
- **New Arrivals grid** — 4-column product cards pulled from MongoDB
- **Cart sidebar** — live item count, currency toggle (USD / PKR)
- **Quick view modal** — image gallery + add-to-cart
- **Bespoke commission modal** — multi-step form (category → details → contact)
- **Search overlay** — full-screen animated search
- **Instagram section + Footer**

---

## Colour Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-light` | `#f1ede8` | Linen/parchment — default section bg |
| `--bg-warm` | `#b5a08a` | Taupe/sandstone — alternating sections |
| `--bg-dark` | `#1a1512` | Deep espresso — dark sections |
| `--text-primary` | `#2c2520` | Near-black on light backgrounds |
| `--text-on-dark` | `#f1ede8` | Cream on dark backgrounds |
| `--gold` | `#b8935a` | Logo accent + special links only |

---

## Project Structure

```
src/
  app/
    globals.css          # All styles
    layout.tsx           # Root layout, fonts, Lenis init
    page.tsx             # Server component — fetches products, renders Homepage
    api/
      products/route.ts  # GET all products from MongoDB
      bespoke/route.ts   # POST bespoke commission inquiry
  components/
    Homepage.tsx         # Entire client-side UI
    SiteShell.tsx        # Shared header/footer shell
    CategoryPage.tsx     # Reusable category listing page
    RoomsPage.tsx        # Rooms & Spaces page
    ShopPage.tsx         # Shop listing page
    ShopTheRoom.tsx      # Shop-the-room feature
  lib/
    mongodb.ts           # DB connection helper
    siteData.ts          # Static nav/content data
  models/
    Product.ts           # Mongoose product schema
    BespokeInquiry.ts    # Mongoose bespoke inquiry schema
public/
  hk1.png, hk2.png, hk3.avif   # Hero lifestyle images
  service.png                    # Services mega-menu image
  [product folders]/             # Per-product image sets
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Seed product data by hitting `GET /api/products` once — the route auto-seeds MongoDB if the collection is empty.

Set your MongoDB connection string in `.env.local`:

```
MONGODB_URI=mongodb+srv://...
```

---

## Design Rules

- No filled buttons — all CTAs are underlined text links (`.cta-link`)
- No rounded corners (exception: mega-menu column images use `border-radius: 4px`)
- No parallax — sections animate with `opacity 0→1, y 30→0` via GSAP ScrollTrigger
- Gold (`#b8935a`) used only on logo accent and "Best sellers" link
- Section backgrounds alternate: linen → taupe → espresso → linen
- Hairline 1px dividers between sections

See `design.md` for the full design system spec.
