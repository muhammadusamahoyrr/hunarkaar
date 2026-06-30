# Hunarkar Design System — v2
## Modelled after RH.com (Restoration Hardware), June 2026

> **Goal:** Replicate RH's editorial luxury homepage feel 1:1, but themed
> for Pakistani artisan crafts. Every section, spacing ratio, and
> typographic decision below is reverse-engineered from `rh.com/us/en/`.

---

## 1. COLOUR PALETTE

RH uses **two distinct background modes** that alternate between sections:

| Token              | RH Value                        | Hunarkar Equivalent            |
| ------------------- | ------------------------------- | ------------------------------ |
| `--bg-light`       | `#f1ede8` warm parchment/linen  | `#f1ede8`                      |
| `--bg-warm`        | `#b5a08a` warm taupe/sandstone  | `#b5a08a`                      |
| `--bg-dark`        | `#2c2520` deep espresso         | `#1a1512`                      |
| `--text-primary`   | `#2c2520` near-black on light   | `#2c2520`                      |
| `--text-on-dark`   | `#f1ede8` cream on dark         | `#f1ede8`                      |
| `--text-secondary` | `#8a7d72` muted stone           | `#8a7d72`                      |
| `--accent`         | none — RH uses NO accent color  | `#b8935a` gold (keep for HK)   |
| `--border`         | `rgba(0,0,0,0.08)` hairlines    | `rgba(0,0,0,0.08)`             |

### Key observations
- RH **never** uses a coloured accent on the homepage (no gold, no blue). Everything is monochromatic earth tones: cream, taupe, espresso.
- The **only** colour pop is `SALE` in the nav, which is a warm red `#c0392b`.
- Background alternates: light parchment sections → warm taupe sections → dark espresso sections. This creates rhythm without colour.
- Text on warm/dark backgrounds is always cream `#f1ede8` or white.
- Thin 1px hairline dividers between sections (barely visible).

---

## 2. TYPOGRAPHY

RH uses a **single** typeface family for almost everything:

| Role           | RH Font                              | Hunarkar Mapping                   |
| -------------- | ------------------------------------ | ---------------------------------- |
| Display / H1   | Custom serif (RH proprietary) — thin weight, extreme tracking | `Cormorant Garamond` 300, tracking `0.25em` |
| Sub-headings   | Same serif, small caps, extra-wide tracking | `Cormorant Garamond` 400, tracking `0.3em`, `text-transform: uppercase` |
| Body copy      | Same serif, regular weight, justified text | `Cormorant Garamond` 400, `text-align: justify` |
| Nav links      | Sans-serif or serif caps with wide tracking | `Jost` 300, tracking `0.2em`, uppercase |
| Tiny labels    | Uppercase, extra-light, max tracking | `Jost` 200, tracking `0.3em` |

### Key typographic observations from RH.com
1. **Hero headline** mixes weights within one line: "the EARLY SUMMER sale" uses italic serif + uppercase serif + italic serif. This creates visual rhythm.
2. **"INTRODUCING"** labels above collection names use `font-size: ~14px`, `letter-spacing: 0.3em`, uppercase.
3. **Collection names** like "VALENCIA" are massive (80-120px), light weight, uppercase, tight leading.
4. **Body paragraphs** in the editorial manifesto section are serif, ~18-20px, justified, with generous line-height (~1.8).
5. **CTA links** are underlined text (not buttons!). Uppercase, tracked, with a 1px underline. e.g. "EXPLORE THE SOURCEBOOK", "CONTINUE READING".
6. **No filled buttons anywhere** on the homepage. All interactions are underlined text links.
7. **"BY"** connector text (e.g. "VALENCIA BY FORMATIONS") uses tiny font, tracked, same serif.

---

## 3. NAVIGATION HEADER

### Structure (exactly as RH)
```
┌──────────────────────────────────────────────────────────────────────┐
│ ☰  🔍              The WORLD of RH (logo)        INTERIOR DESIGN 👤 🛒│
├──────────────────────────────────────────────────────────────────────┤
│ ESTATES  LIVING  DINING  BED  BATH  OUTDOOR  LIGHTING ... SALE     │
└──────────────────────────────────────────────────────────────────────┘
```

### RH Nav Details
- **Two-row header**: Top row = hamburger + search (left), centred logo, account + cart (right). Bottom row = category links, evenly spaced.
- **Logo** is centred, multi-line: "The" (small), "WORLD of" (small), "RH" (large serif).
- **Category bar** is a separate row below, full-width, uppercase, tracked, evenly distributed.
- **No background** initially — fully transparent over the hero image.
- **On scroll**: white/cream background fades in with `backdrop-filter: blur`.
- **Spacing**: Top row padding ~20px 40px. Category row padding ~12px 40px.
- **Hamburger icon**: 3 horizontal lines, thin, left-aligned.
- **Search icon**: Magnifying glass, left-aligned next to hamburger.
- **"INTERIOR DESIGN"** text link right-aligned, tracked uppercase, before account/cart icons.
- **"SALE"** link at end of category bar in warm red.

### Hunarkar Adaptation
```
┌──────────────────────────────────────────────────────────────────────┐
│ ☰  🔍              HUNARKAR (logo)             PKR/USD  👤  ♡  🛒  │
├──────────────────────────────────────────────────────────────────────┤
│ POTTERY  TEXTILES  WOODWORK  BRASS  KHUSSA  ONYX  BESPOKE  ARTISANS│
└──────────────────────────────────────────────────────────────────────┘
```

---

## 4. HERO SECTION

### RH Hero (observed)
- **Full-viewport-width image**, edge-to-edge, ~80-90vh height.
- **High-quality lifestyle photography** — interior room shot, warm natural lighting, soft focus depth.
- **Text overlay** centred, white/cream on the image:
  - Small subheading: "RH MEMBERS SAVE UP TO 70%" — uppercase, tracked, ~14px
  - Main headline: "the EARLY SUMMER sale" — mixed italic + uppercase, ~60-80px
  - Sub-line: "ENDS SOON" — uppercase, tracked, ~40px
- **No CTA button** — just the text. The entire hero is not clickable either.
- **No darkening overlay** or very subtle one — the image itself has enough contrast.
- **No video** on current homepage — it's a static high-res image.

### Hunarkar Adaptation
- Full-width hero, 90vh, with a **video of artisan hands** working clay or weaving.
- Subtle dark overlay (0.3 opacity) for text readability.
- Centre-aligned text:
  - Small: "WHERE CRAFT BECOMES HERITAGE" — uppercase, tracked
  - Large: "the ARTISAN collection" — mixed weights
  - Sub: "HANDMADE IN PAKISTAN" — uppercase, tracked

---

## 5. CONTENT SECTIONS — STACKED EDITORIAL BLOCKS

This is where RH's design is most distinctive. The homepage is a **vertical stack of full-width editorial panels**, NOT a grid. Each section is a self-contained cinematic moment.

### Section Pattern A: Full-Width Image Block
```
┌─────────────────────────────────────────────┐
│                                             │
│         (full-width lifestyle image)        │
│                 90vh tall                    │
│                                             │
│        CENTRED TEXT OVERLAY (white)          │
│     "THE EARLY SUMMER SALE"                 │
│     "SAVE UP TO 60% ON OUTDOOR"             │
│     "ENDS SOON"                             │
│                                             │
└─────────────────────────────────────────────┘
```
- Image is 100vw, ~80-90vh.
- Text centred, white, serif, mixed weights.
- Thin 1px white/cream border between sections.

### Section Pattern B: Two-Column Editorial (Image + Text)
```
┌─────────────────────┬───────────────────────┐
│                     │  INTRODUCING          │
│  (Product/Book      │  RH ESTATES           │
│   Image — ~50vw)    │                       │
│                     │  Body paragraph...    │
│                     │  justified serif...   │
│                     │                       │
│                     │  EXPLORE THE SOURCE   │
│                     │  REQUEST A SOURCEBOOK │
│                     │  SHOP BY ROOM         │
└─────────────────────┴───────────────────────┘
```
- Background: warm taupe `#b5a08a` or similar.
- Left: product image occupying ~50% width.
- Right: text block with generous padding (~80-120px).
- "INTRODUCING" label: tiny, tracked, uppercase.
- Collection name: massive serif, light weight.
- Body text: serif, justified, ~18px, generous line-height.
- CTAs: stacked underlined text links, NOT buttons. Each on its own line, separated by ~20px.

### Section Pattern C: Founder Manifesto (Image + Long-Form Text)
```
┌─────────────────────┬───────────────────────┐
│                     │                       │
│  (B&W portrait      │  "MR. GORBACHEV,     │
│   photo — ~35vw)    │   TEAR DOWN THIS      │
│                     │   WALL"               │
│                     │   — RONALD REAGAN     │
│                     │                       │
│                     │  Long justified body  │
│                     │  text paragraph...    │
│                     │                       │
│                     │  CONTINUE READING     │
└─────────────────────┴───────────────────────┘
```
- Background: light parchment `#f1ede8`.
- Text: dark espresso `#2c2520`.
- Portrait image is B&W, ~35% width, left-aligned.
- Quote is in massive thin serif, ~50-60px.
- Attribution in small caps, tracked.
- Body text: justified, serif, ~18px.

### Section Pattern D: Two-Column Product Showcase
```
┌──────────────────────┬─────────────────────┐
│                      │                     │
│  (Product image with │  (Product image     │
│   text overlay)      │   detail close-up)  │
│                      │                     │
│  INTRODUCING         │                     │
│  VALENCIA            │                     │
│  BY FORMATIONS       │                     │
│                      │                     │
│  Description text... │                     │
└──────────────────────┴─────────────────────┘
```
- Two side-by-side images, slight gap (~4-8px) between them.
- Left image has text overlay.
- Right image is a detail close-up (zoomed in on craftsmanship).

### Section Pattern E: 3×2 Colour/Finish Grid
```
┌────────┬────────┬────────┐
│ BONE   │ TAUPE  │ SMOKE  │
│ (img)  │ (img)  │ (img)  │
├────────┼────────┼────────┤
│ (img)  │ (img)  │ (img)  │
└────────┴────────┴────────┘
```
- Grid of finish/colour swatches — detail close-up images.
- Label text overlaid on each image: small, uppercase, tracked.
- Tight gap between cells (~2-4px).
- Descriptive text overlaid on top-right area of grid in small italic serif.

### Section Pattern F: Full-Width Room Scene
```
┌─────────────────────────────────────────────┐
│                                             │
│         (Full-width room scene)             │
│                                             │
│         Furniture styled in context         │
│         No text overlay                     │
│                                             │
└─────────────────────────────────────────────┘
```
- Edge-to-edge lifestyle room photograph.
- NO text overlay — purely visual.
- Serves as a "palette cleanser" between text-heavy sections.

---

## 6. SECTION DIVIDERS & SPACING

- **Between sections**: 1px hairline in `rgba(0,0,0,0.08)` on light backgrounds, `rgba(255,255,255,0.1)` on dark.
- **Section padding**: Generous — `100px 0` minimum, often `140px 0`.
- **Text blocks**: Internal padding `80-120px` on each side.
- **No rounded corners** anywhere. Everything is sharp rectangles.
- **No box shadows** except extremely subtle ones on the nav when scrolled.

---

## 7. CTAs & INTERACTIVE ELEMENTS

### RH uses ZERO filled buttons on the homepage.

All call-to-action elements are **underlined text links**:
- Uppercase
- Tracked (`letter-spacing: 0.15em`)
- Serif or sans-serif, light weight
- 1px solid underline (not text-decoration — a real `border-bottom`)
- On hover: underline thickens or text colour shifts slightly

### Link style specification
```css
.cta-link {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-on-dark);
  border-bottom: 1px solid currentColor;
  padding-bottom: 4px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}
.cta-link:hover {
  opacity: 0.7;
}
```

---

## 8. ANIMATIONS & SCROLL BEHAVIOUR

### What RH does (and doesn't do)
- **NO parallax** on the current homepage. Images are static, fixed-size.
- **NO clip-path reveals**. Content simply fades in.
- **Smooth scroll** with very subtle easing (Lenis-style).
- **Fade-in on scroll**: Sections fade from `opacity: 0` to `opacity: 1` with a slight `translateY(30px)` as they enter the viewport.
- **No bouncy, springy, or elastic animations**. Everything is slow, graceful, measured.
- **Transition timing**: `0.8s ease` or `1.2s ease` — never fast.

### GSAP ScrollTrigger setup
```
- trigger: each section
- start: "top 80%"
- animation: opacity 0→1, y 30→0, duration 1s, ease "power2.out"
- stagger: 0.15s between child elements
```

---

## 9. FOOTER

RH footer is minimal:
- Light background, thin top border.
- Columns of links in small uppercase tracked text.
- Copyright at bottom.
- No large logos or graphics.

---

## 10. HUNARKAR HOMEPAGE SECTION ORDER

Mapping RH's section flow to Hunarkar content:

| #  | RH Pattern Used     | Hunarkar Content                                  |
|----|---------------------|---------------------------------------------------|
| 01 | Nav (2-row)         | Hunarkar logo, craft categories, PKR/USD, cart    |
| 02 | Hero (Pattern A)    | Full-width video — artisan hands, centred text    |
| 03 | Full-Width (A)      | "THE ARTISAN COLLECTION" — lifestyle craft scene  |
| 04 | Two-Col Editorial(B)| "INTRODUCING HUNARKAR" — book/catalog + manifesto |
| 05 | Founder Story (C)   | Founder portrait + mission statement              |
| 06 | Two-Col Product (D) | Featured craft — e.g. Blue Pottery close-ups      |
| 07 | Finish Grid (E)     | Craft variations — colour/finish swatches         |
| 08 | Room Scene (F)      | Full-width styled interior with Hunarkar products |
| 09 | Full-Width (A)      | "BESPOKE COMMISSIONS" — CTA section               |
| 10 | Product Grid        | New arrivals — 4-column product cards             |
| 11 | Footer              | Minimal footer with link columns                  |

---

## 11. CRITICAL DIFFERENCES FROM CURRENT HK DESIGN

| Current HK Problem                     | RH-Correct Approach                                |
|----------------------------------------|-----------------------------------------------------|
| Dark bg (#0e0b08) everywhere           | Alternate light/warm/dark backgrounds per section   |
| Gold accent overused                   | Monochromatic earth tones, gold only on logo accent |
| Filled buttons with borders            | Underlined text links only                          |
| Rounded pill buttons                   | No rounded corners anywhere                         |
| Busy nav with currency pill toggle     | Clean 2-row nav, currency as plain text toggle      |
| Small hero text, too many elements     | Massive serif headline, minimal text, mixed weights |
| Grid-based craft cards                 | Full-width editorial stacked panels                 |
| Parallax, clip-path reveals            | Simple fade-in on scroll, no parallax               |
| Scrollbar styled gold                  | Default or very subtle scrollbar                    |
| "Explore Collection" filled button     | "EXPLORE THE COLLECTION" underlined text link       |
| Ticker/marquee banner                  | Remove — RH has no marquee                          |

---

## 12. IMAGE STRATEGY

- All images should be **full-width** or **half-width** (50vw) — no small thumbnails except in product grid.
- Lifestyle photography should show products **in context** (a room, a table setting, a person wearing it).
- Detail shots should be **extreme close-ups** of texture, material, craftsmanship.
- B&W for portrait photography.
- Warm, natural lighting for product photography.
- **No filters, no artificial overlays** — the photography should be so good it doesn't need enhancement.