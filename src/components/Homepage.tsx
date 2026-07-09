'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import ShopTheRoom from './ShopTheRoom';

/* ============================================================
   TYPE DEFINITIONS
   ============================================================ */
interface ProductItem {
  id: string;
  name: string;
  category: string;
  usdPrice: number;
  pkrPrice: number;
  img: string;
  description: string;
  artisan: string;
}

interface CartItem extends ProductItem {
  quantity: number;
}

interface HomepageProps {
  initialProducts: ProductItem[];
}

/* ============================================================
   CRAFT CATEGORIES DATA
   ============================================================ */
const CATEGORIES = [
  {
    id: 'blue-pottery',
    name: 'Blue Pottery',
    tag: 'Handpainted Clay',
    img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/blue-pottery/900/700',
    cardClass: 'hg-card-1',
  },
  {
    id: 'ajrak',
    name: 'Ajrak',
    tag: 'Natural Indigo Block Print',
    img: 'https://images.unsplash.com/photo-1590736969955-71cb94801759?w=600&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/ajrak-print/600/500',
    cardClass: 'hg-card-2',
  },
  {
    id: 'ralli',
    name: 'Ralli Quilts',
    tag: 'Patchwork Applique',
    img: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/ralli-quilt/600/500',
    cardClass: 'hg-card-3',
  },
  {
    id: 'khussa',
    name: 'Khussa',
    tag: 'Embroidered Leather',
    img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/khussa-shoes/600/500',
    cardClass: 'hg-card-4',
  },
  {
    id: 'woodcarving',
    name: 'Woodcarving',
    tag: 'Chinioti Walnut Wood',
    img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/wood-carve/600/500',
    cardClass: 'hg-card-5',
  },
  {
    id: 'brass',
    name: 'Brasswork',
    tag: 'Hand-hammered Metalware',
    img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/brass-work/600/500',
    cardClass: 'hg-card-6',
  },
  {
    id: 'onyx',
    name: 'Onyx Crafts',
    tag: 'Hand-carved Stone',
    img: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be2597?w=900&auto=format&fit=crop&q=80',
    fallback: 'https://picsum.photos/seed/onyx-stone/900/500',
    cardClass: 'hg-card-7',
  },
];

const MEGA_PRODUCTS = [
  'Chairs and stools',
  'Sofas and poufs',
  'Tables and side tables',
  'Shelving and storage',
  'Outdoor furniture',
  'Lighting',
  'Rugs',
  'Tableware',
  'Throws and cushions',
  'Decor',
];

const MEGA_ARTISANS = [
  'Master Potters',
  'Textile Weavers',
  'Wood Carvers',
  'Brass Smiths',
  'Onyx Craftsmen',
  'Rug Makers',
];

const MEGA_SERVICES = [
  'Interior Consultation',
  'Gift Registry',
  'Trade Programme',
  'Worldwide Shipping',
  'Care & Restoration',
];

const MEGA_HERITAGE = [
  'Our Story',
  'Fair Trade & Ethics',
  'The Craft Process',
  'Heritage Journal',
  'Certificate of Authenticity',
  'Press & Media',
];

const INSTA_IMGS = [
  { seed: 'artisan-hand-1', alt: 'Artisan at work 1' },
  { seed: 'craft-process-2', alt: 'Craft process 2' },
  { seed: 'pottery-detail', alt: 'Blue pottery detail' },
  { seed: 'ajrak-fabric', alt: 'Ajrak fabric closeup' },
  { seed: 'khussa-craft', alt: 'Khussa embroidery' },
  { seed: 'brass-hammer', alt: 'Brasswork hammering' },
];

/* ============================================================
   FALLBACK-SAFE IMAGE COMPONENT
   ============================================================ */
function SafeImg({
  src,
  fallback,
  alt,
  className,
  style,
}: {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => setImgSrc(fallback || `https://picsum.photos/seed/${alt.replace(/\s/g, '-')}/800/600`)}
      loading="lazy"
    />
  );
}

/* ============================================================
   NAV MENU DATA — single-column dropdown per category
   ============================================================ */
type NavLink    = { label: string; isNew?: boolean; img?: string };
type NavSection = { heading?: string; links: NavLink[] };
type NavMenu    = { tagline?: string; defaultImg: string; portraitImg: string; featured: { name: string; craft: string; }; editImg2: string; caption1: string; caption2: string; popularLabel?: string; sections: NavSection[] };

const IMG       = (id: string) => `https://images.unsplash.com/${id}?w=600&auto=format&fit=crop&q=80`;
const PORTRAIT  = (id: string) => `https://images.unsplash.com/${id}?w=400&h=600&auto=format&fit=crop&crop=faces%2Cfocal&q=80`;
const PORTEDIT  = (id: string) => `https://images.unsplash.com/${id}?w=400&h=520&auto=format&fit=crop&crop=faces%2Cfocal&q=80`;

const NAV_MENUS: Record<string, NavMenu> = {
  Estates: {
    tagline: 'Curated living spaces for the discerning Pakistani home.',
    defaultImg: IMG('photo-1564078516393-cf04bd966897'),
    portraitImg: PORTRAIT('photo-1564078516393-cf04bd966897'),
    featured: { name: 'The Drawing Room Edit', craft: 'Carved walnut & handwoven silk pieces' },
    editImg2: PORTEDIT('photo-1616137466211-f939a420be84'),
    caption1: 'The Curated Estate',
    caption2: 'Heritage Interiors',
    popularLabel: 'Estate Picks',
    sections: [{ links: [
      { label: 'Drawing Room Collections' },
      { label: 'Formal Dining Sets' },
      { label: 'Master Suite Pieces' },
      { label: 'Veranda & Courtyard' },
      { label: 'Bespoke Commissions' },
    ]}],
  },
  Living: {
    tagline: 'Handcrafted by master woodcarvers across Chiniot and Lahore.',
    defaultImg: IMG('photo-1691036561573-4b76998b60de'),
    portraitImg: PORTRAIT('photo-1691036561573-4b76998b60de'),
    featured: { name: 'Chinioti Sofa Collection', craft: 'Hand-carved walnut, silk upholstery' },
    editImg2: PORTEDIT('photo-1567538096630-e0c55bd6374c'),
    caption1: 'Master Woodcraft',
    caption2: 'The Living Edit',
    popularLabel: 'Room Essentials',
    sections: [{ links: [
      { label: 'Sofas & Settees' },
      { label: 'Lounge Chairs' },
      { label: 'Ottomans & Poufs' },
      { label: 'Coffee Tables' },
      { label: 'Console Tables' },
      { label: 'Display Cabinets' },
    ]}],
  },
  Dining: {
    tagline: 'Where every meal becomes a ceremony of craft.',
    defaultImg: IMG('photo-1555396273-367ea4eb4db5'),
    portraitImg: PORTRAIT('photo-1555396273-367ea4eb4db5'),
    featured: { name: 'Brass Dinner Service', craft: 'Hand-hammered in Lahore workshops' },
    editImg2: PORTEDIT('photo-1414235077428-338989a2e8c0'),
    caption1: 'The Art of Gathering',
    caption2: 'Craft at the Table',
    popularLabel: 'Table Essentials',
    sections: [{ links: [
      { label: 'Dining Tables' },
      { label: 'Dining Chairs' },
      { label: 'Pottery Dinner Sets', isNew: true },
      { label: 'Brass Cutlery' },
      { label: 'Tea Sets' },
    ]}],
  },
  Bed: {
    tagline: 'Rest in the tradition of Mughal-era comfort and artistry.',
    defaultImg: IMG('photo-1631049307264-da0ec9d70304'),
    portraitImg: PORTRAIT('photo-1631049307264-da0ec9d70304'),
    featured: { name: 'Carved Bed Frame', craft: 'Chiniot walnut with floral inlay motifs' },
    editImg2: PORTEDIT('photo-1505693416388-ac5ce068fe85'),
    caption1: 'Heritage Rest',
    caption2: 'Mughal-era Comfort',
    popularLabel: 'Sleep Essentials',
    sections: [{ links: [
      { label: 'Carved Bed Frames' },
      { label: 'Nightstands' },
      { label: 'Razai & Quilts' },
      { label: 'Throws & Blankets' },
      { label: 'Dressing Tables' },
    ]}],
  },
  Bath: {
    tagline: 'Hammam rituals reimagined for the contemporary home.',
    defaultImg: IMG('photo-1596178060671-7a80dc8059ea'),
    portraitImg: PORTRAIT('photo-1596178060671-7a80dc8059ea'),
    featured: { name: 'Hammam Linen Set', craft: 'Stone-washed Turkish cotton weave' },
    editImg2: PORTEDIT('photo-1540555700478-4be289fbecef'),
    caption1: 'The Hammam Ritual',
    caption2: 'Crafted for Serenity',
    popularLabel: 'Bath Essentials',
    sections: [{ links: [
      { label: 'Hammam Towels', isNew: true },
      { label: 'Bath Robes' },
      { label: 'Soap Dishes' },
      { label: 'Brass Fixtures' },
      { label: 'Vanity Mirrors' },
    ]}],
  },
  Outdoor: {
    tagline: 'From the courtyards of Lahore to your veranda.',
    defaultImg: 'https://media.istockphoto.com/id/2212038852/photo/patio-with-rustic-wooden-furniture-blue-shutters-and-wicker-lamps.webp?a=1&b=1&s=612x612&w=0&k=20&c=Hwen62gkH421CRXff96pIzmngjWd5XjB7UtQqnwSQeY=',
    portraitImg: 'https://media.istockphoto.com/id/2212038852/photo/patio-with-rustic-wooden-furniture-blue-shutters-and-wicker-lamps.webp?a=1&b=1&s=612x612&w=0&k=20&c=Hwen62gkH421CRXff96pIzmngjWd5XjB7UtQqnwSQeY=',
    featured: { name: 'Jhoola Swing Chair', craft: 'Hand-knotted jute cord, teak frame' },
    editImg2: PORTEDIT('photo-1621506821957-1b50ab7787a4'),
    caption1: 'The Courtyard Edit',
    caption2: 'Lahori Garden Living',
    popularLabel: 'Garden Picks',
    sections: [{ links: [
      { label: 'Jhoola & Swing Chairs' },
      { label: 'Garden Sofas' },
      { label: 'Outdoor Dining Sets' },
      { label: 'Planters & Clay Pots' },
      { label: 'Courtyard Fountains', isNew: true },
    ]}],
  },
  Lighting: {
    tagline: 'Hand-forged brass and fired clay, illuminating heritage.',
    defaultImg: IMG('photo-1524484485831-a92ffc0de03f'),
    portraitImg: PORTRAIT('photo-1524484485831-a92ffc0de03f'),
    featured: { name: 'Forged Brass Lantern', craft: 'Hand-hammered, Lahore brassware tradition' },
    editImg2: PORTEDIT('photo-1507473885765-e6ed057f782c'),
    caption1: 'Illuminated Heritage',
    caption2: 'The Brass Edit',
    popularLabel: 'Light the Space',
    sections: [{ links: [
      { label: 'Chandeliers' },
      { label: 'Pendant Lights' },
      { label: 'Table Lamps' },
      { label: 'Wall Sconces' },
      { label: 'Brass Lanterns' },
      { label: 'Diyas & Oil Lamps', isNew: true },
    ]}],
  },
  Textiles: {
    tagline: 'Woven in Sindh, dyed in Multan, finished entirely by hand.',
    defaultImg: IMG('photo-1779470703519-05af825e87cd'),
    portraitImg: PORTRAIT('photo-1779470703519-05af825e87cd'),
    featured: { name: 'Phulkari Wall Panel', craft: 'Embroidered in Multan, pure silk thread' },
    editImg2: PORTEDIT('photo-1773842298512-e49c9331cc3d'),
    caption1: 'Woven in Sindh',
    caption2: 'The Phulkari Story',
    popularLabel: "Weaver's Choice",
    sections: [{ links: [
      { label: 'Cushion Covers' },
      { label: 'Curtains & Drapes' },
      { label: 'Throws & Shawls' },
      { label: 'Ajrak Fabric' },
      { label: 'Phulkari Panels', isNew: true },
      { label: 'Wall Hangings' },
    ]}],
  },
  Rugs: {
    tagline: 'Knotted by master weavers across Balochistan and Sindh.',
    defaultImg: IMG('photo-1594040226829-7f251ab46d80'),
    portraitImg: PORTRAIT('photo-1594040226829-7f251ab46d80'),
    featured: { name: 'Balouchi Hand-knotted Kilim', craft: 'Natural wool, Balochistan provenance' },
    editImg2: PORTEDIT('photo-1600166898405-da9535204843'),
    caption1: 'Hand-knotted in Balochistan',
    caption2: 'The Kilim Edit',
    popularLabel: 'Rug Highlights',
    sections: [{ links: [
      { label: 'Kilim' },
      { label: 'Dhurrie' },
      { label: 'Balouchi' },
      { label: 'Sindhi Hand-knotted' },
      { label: 'Patchwork' },
      { label: 'Custom Rugs', isNew: true },
    ]}],
  },
  'Décor': {
    tagline: 'Objects of quiet beauty, made to outlast their makers.',
    defaultImg: IMG('photo-1594026112284-02bb6f3352fe'),
    portraitImg: PORTRAIT('photo-1594026112284-02bb6f3352fe'),
    featured: { name: 'Multani Pottery Vase', craft: 'Handpainted cobalt on fired clay' },
    editImg2: PORTEDIT('photo-1590605095243-072811dbe64c'),
    caption1: 'Objects of Beauty',
    caption2: 'The Multani Craft',
    popularLabel: 'Décor Picks',
    sections: [{ links: [
      { label: 'Multani Pottery' },
      { label: 'Onyx Sculptures' },
      { label: 'Handpainted Vases' },
      { label: 'Calligraphy Panels', isNew: true },
      { label: 'Miniature Art Frames' },
    ]}],
  },
  'Baby & Child': {
    tagline: 'Heirloom craftsmanship for the smallest members of the family.',
    defaultImg: IMG('photo-1503454537195-1dcabb73ffb9'),
    portraitImg: PORTRAIT('photo-1503454537195-1dcabb73ffb9'),
    featured: { name: 'Painted Toy Collection', craft: 'Non-toxic lacquered hardwood' },
    editImg2: PORTEDIT('photo-1515488042361-ee00e0ddd4e4'),
    caption1: 'Made for Little Ones',
    caption2: 'Heirloom Childhood',
    popularLabel: 'Baby Favourites',
    sections: [{ links: [
      { label: 'Cribs & Cots' },
      { label: 'Kids Chairs' },
      { label: 'Wooden Toys', isNew: true },
      { label: 'Crib Quilts & Bedding' },
      { label: 'Night Lights' },
    ]}],
  },
  Teen: {
    tagline: 'Contemporary craft for the next generation.',
    defaultImg: IMG('photo-1560185007-cde436f6a4d0'),
    portraitImg: PORTRAIT('photo-1560185007-cde436f6a4d0'),
    featured: { name: 'Sheesham Study Desk', craft: 'Sustainable hand-finished hardwood' },
    editImg2: PORTEDIT('photo-1598300042247-d088f8ab3a91'),
    caption1: 'Crafted for the Future',
    caption2: 'The Next Generation Edit',
    popularLabel: 'Teen Picks',
    sections: [{ links: [
      { label: 'Beds & Lofts' },
      { label: 'Study Desks' },
      { label: 'Poufs & Floor Seating' },
      { label: 'Duvet Sets' },
      { label: 'Wall Art & Calligraphy', isNew: true },
    ]}],
  },
  Sale: {
    tagline: 'Curated markdowns on exceptional Pakistani craft.',
    defaultImg: IMG('photo-1607082348824-0a96f2a4b9da'),
    portraitImg: PORTRAIT('photo-1607082348824-0a96f2a4b9da'),
    featured: { name: 'Curated Markdowns', craft: 'Select heritage pieces, reduced prices' },
    editImg2: PORTEDIT('photo-1483985988355-763728e1935b'),
    caption1: 'Curated Markdowns',
    caption2: 'Heritage at its Best',
    popularLabel: 'Best Deals',
    sections: [{ links: [
      { label: 'New Markdowns', isNew: true },
      { label: 'Living Room' },
      { label: 'Dining Room' },
      { label: 'Bedroom' },
      { label: 'Lighting' },
      { label: 'Final Clearance' },
    ]}],
  },
};

const CATEGORY_ROUTES: Record<string, string> = {
  Living: '/shop/living',
  Textiles: '/textiles',
};

const NAV_ITEMS: Array<{ name: string; extraClass?: string; href?: string }> = [
  { name: 'Estates' },
  { name: 'Living' },
  { name: 'Dining' },
  { name: 'Bed' },
  { name: 'Bath' },
  { name: 'Outdoor' },
  { name: 'Lighting' },
  { name: 'Textiles', href: '/textiles' },
  { name: 'Rugs' },
  { name: 'Décor' },
  { name: 'Baby & Child', extraClass: 'nav-baby-child' },
  { name: 'Teen',         extraClass: 'nav-baby-child' },
  { name: 'Sale',         extraClass: 'nav-sale' },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function Homepage({ initialProducts }: HomepageProps) {
  const [products] = useState<ProductItem[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'PKR'>('USD');

  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuClosing, setMenuClosing] = useState(false);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [previewImg, setPreviewImg] = useState('');
  const [previewVer, setPreviewVer] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bespokeOpen, setBespokeOpen] = useState(false);
  const [quickView, setQuickView] = useState<ProductItem | null>(null);

  const [bespokeStep, setBespokeStep] = useState(1);
  const [craftType, setCraftType] = useState('Blue Pottery');
  const [dimensions, setDimensions] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userWA, setUserWA] = useState('');

  const [heroSlide, setHeroSlide] = useState(0);
  const slideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lenisRef         = useRef<Lenis | null>(null);
  const menuTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ----------------------------------------------------------
     LENIS + GSAP INIT
  ---------------------------------------------------------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /* ---- PRELOADER SEQUENCE ---- */
    const preloaderTl = gsap.timeline({
      onComplete: () => {
        const el = document.getElementById('preloader');
        if (el) el.style.display = 'none';
        initScrollEffects();
        // Start hero Ken Burns cycling after preloader completes
        slideIntervalRef.current = setInterval(() => {
          setHeroSlide(prev => (prev === 0 ? 1 : prev === 1 ? 2 : 0));
        }, 7000);
      }
    });

    preloaderTl
      .to('.loader-logo', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' })
      .to('.loader-sub', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .to('#loader-progress-bar', { width: '100%', duration: 1.8, ease: 'power1.inOut' }, '-=0.2')
      .to('.loader-content', { opacity: 0, y: -24, duration: 0.5, ease: 'power2.in' })
      .to('#preloader', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '-=0.15');

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    };
  }, []);

  /* ----------------------------------------------------------
     A11Y KEYBOARD LISTENERS (ESCAPE TO CLOSE)
  ---------------------------------------------------------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false);
        setSearchOpen(false);
        closeBespoke();
        setQuickView(null);
        setMobileMenuOpen(false);
        setActiveMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* ----------------------------------------------------------
     SCROLL EFFECTS
  ---------------------------------------------------------- */
  const initScrollEffects = () => {
    /* Header scroll state */
    ScrollTrigger.create({
      start: 'top -60',
      onUpdate: (self) => {
        const hdr = document.getElementById('site-header');
        if (!hdr) return;
        if (self.scroll() > 60) hdr.classList.add('scrolled');
        else hdr.classList.remove('scrolled');
      }
    });

    /* Editorial split panels animation */
    document.querySelectorAll('.editorial-split').forEach((el) => {
      const media = el.querySelector('.editorial-media');
      const content = el.querySelector('.editorial-content');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      });
      
      if (media) {
        tl.fromTo(media, 
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
        );
      }
      
      if (content) {
        tl.fromTo(content.children,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
          '-=0.8'
        );
      }
    });

    /* Product cards stagger */
    gsap.fromTo('.product-card',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#new-arrivals',
          start: 'top 78%'
        }
      }
    );

    /* Instagram grid stagger scale */
    gsap.fromTo('.instagram-item',
      { scale: 0.92, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#instagram-section',
          start: 'top 82%'
        }
      }
    );
  };

  /* ----------------------------------------------------------
     RESET PREVIEW IMAGE WHEN ACTIVE MENU CHANGES
  ---------------------------------------------------------- */
  useEffect(() => {
    if (activeMenu && NAV_MENUS[activeMenu]) {
      setPreviewImg(NAV_MENUS[activeMenu].portraitImg);
      setPreviewVer(v => v + 1);
    }
  }, [activeMenu]);

  /* ----------------------------------------------------------
     FORCE HEADER LIGHT STATE WHEN MEGA-MENU IS OPEN
  ---------------------------------------------------------- */
  useEffect(() => {
    const hdr = document.getElementById('site-header');
    if (!hdr) return;
    if (mobileMenuOpen) {
      hdr.classList.add('scrolled');
    } else {
      if (typeof window !== 'undefined' && window.scrollY <= 60) {
        hdr.classList.remove('scrolled');
      }
    }
  }, [mobileMenuOpen]);

  /* ----------------------------------------------------------
     LENIS PAUSE ON OVERLAYS
  ---------------------------------------------------------- */
  useEffect(() => {
    if (!lenisRef.current) return;
    const anyOpen = cartOpen || searchOpen || bespokeOpen || !!quickView || mobileMenuOpen;
    if (anyOpen) {
      lenisRef.current.stop();
      document.body.classList.add('no-scroll');
    } else {
      lenisRef.current.start();
      document.body.classList.remove('no-scroll');
    }
  }, [cartOpen, searchOpen, bespokeOpen, quickView, mobileMenuOpen]);

  /* ----------------------------------------------------------
     CART HELPERS
  ---------------------------------------------------------- */
  const addToCart = (product: ProductItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const openMenu = (name: string, left: number) => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    menuTimerRef.current = setTimeout(() => {
      setDropdownLeft(left);
      setActiveMenu(name);
      setMobileMenuOpen(false);
    }, 150);
  };

  const closeMenu = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setMenuClosing(true);
    menuTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
      setMenuClosing(false);
    }, 150);
  };

  const scheduleClose = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    menuTimerRef.current = setTimeout(closeMenu, 140);
  };

  const cancelClose = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setMenuClosing(false);
  };

  const formatPrice = (usd: number, pkr: number) =>
    currency === 'USD' ? `$${usd.toFixed(2)}` : `₨ ${pkr.toLocaleString()}`;

  const getSubtotal = () => {
    if (currency === 'USD') return `$${cart.reduce((s, i) => s + i.usdPrice * i.quantity, 0).toFixed(2)}`;
    return `₨ ${cart.reduce((s, i) => s + i.pkrPrice * i.quantity, 0).toLocaleString()}`;
  };

  /* ----------------------------------------------------------
     BESPOKE SUBMIT
  ---------------------------------------------------------- */
  const handleBespokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bespoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ craft: craftType, dimensions, userName, userEmail, userWhatsApp: userWA })
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

  const closeBespoke = () => {
    setBespokeOpen(false);
    setBespokeStep(1);
    setCraftType('Blue Pottery');
    setDimensions('');
    setUserName('');
    setUserEmail('');
    setUserWA('');
  };

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */
  return (
    <>
      {/* =====================================================
           PRELOADER
         ===================================================== */}
      <div id="preloader">
        <div className="loader-content">
          <div className="loader-logo">Hunarkar</div>
          <div className="loader-sub">Where Craft Becomes Heritage</div>
          <div className="loader-progress-track">
            <div id="loader-progress-bar" />
          </div>
        </div>
      </div>

      {/* =====================================================
           FIXED HEADER — RH-style two-tier
         ===================================================== */}
      <header id="site-header">
        {/* Top bar: left icons · logo · right actions */}
        <div className="header-top-bar">
          {/* Left */}
          <div className="header-left">
            <button
              id="mobile-menu-btn"
              className={`header-icon-btn menu-toggle${mobileMenuOpen ? ' open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span className="hamburger-icon"><span /><span /><span /></span>
            </button>
            <button
              id="search-open-btn"
              className="header-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>

          {/* Center Logo */}
          <div className="header-logo-wrap">
            <a href="#" className="logo" id="main-logo">
              H<em>unarkar</em>
            </a>
          </div>

          {/* Right */}
          <div className="header-right">
            {/* Interior Design text link — mirrors RH's right-side text link */}
            <button
              className="header-interior-design"
              onClick={() => setBespokeOpen(true)}
            >
              Interior Design
            </button>

            {/* Profile icon */}
            <button
              className="header-icon-btn"
              onClick={() => alert('Profile and Membership settings panel coming soon!')}
              aria-label="User Account"
            >
              <i className="fa-regular fa-user" />
            </button>

            {/* Bag */}
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

        {/* Category nav bar — each item opens its own single-column dropdown */}
        <nav className="header-nav-bar" aria-label="Main navigation" onMouseLeave={scheduleClose}>
          {NAV_ITEMS.map(({ name, extraClass, href }) => (
            <button
              key={name}
              className={`nav-category-link${extraClass ? ` ${extraClass}` : ''}${activeMenu === name ? ' nav-active' : ''}`}
              onMouseEnter={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                openMenu(name, rect.left);
              }}
              onMouseLeave={scheduleClose}
              onClick={(e) => {
                if (href) { window.location.href = href; return; }
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                activeMenu === name ? closeMenu() : openMenu(name, rect.left);
              }}
            >
              {name}
            </button>
          ))}
        </nav>
      </header>

      {/* =====================================================
           CATEGORY DROPDOWN — full-width editorial layout
         ===================================================== */}
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
              {/* ── Left: heading + links ── */}
              <div className="cat-links-col">
                <div className="cat-menu-heading">{activeMenu}</div>
                <a href={CATEGORY_ROUTES[activeMenu] ?? '#new-arrivals'} className="cat-shopall" onClick={() => setActiveMenu(null)}>
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
                                href="#new-arrivals"
                                className="cat-link"
                                onClick={() => setActiveMenu(null)}
                                onMouseEnter={() => {
                                  const src = link.img || NAV_MENUS[activeMenu!].portraitImg;
                                  setPreviewImg(src);
                                  setPreviewVer(v => v + 1);
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

              {/* ── Separator ── */}
              <div className="cat-col-sep" />

              {/* ── Right: 2 editorial image cards ── */}
              <div className="cat-editorial-cards">
                <div className="cat-ed-card">
                  <div className="cat-ed-img-wrap">
                    {previewImg && <img key={previewVer} src={previewImg} alt="" className="cat-preview-img" />}
                    <div className="cat-ed-overlay">
                      <span className="cat-ed-caption">{NAV_MENUS[activeMenu].caption1}</span>
                    </div>
                  </div>
                  <a href="#new-arrivals" className="cat-ed-link" onClick={() => setActiveMenu(null)}>
                    Shop the Edit →
                  </a>
                </div>
                <div className="cat-ed-card">
                  <div className="cat-ed-img-wrap">
                    <img src={NAV_MENUS[activeMenu].editImg2} alt="" />
                    <div className="cat-ed-overlay">
                      <span className="cat-ed-caption">{NAV_MENUS[activeMenu].caption2}</span>
                    </div>
                  </div>
                  <a href="#new-arrivals" className="cat-ed-link" onClick={() => setActiveMenu(null)}>
                    Explore →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================
           HAMBURGER DROPDOWN — full-width 4-col panel
         ===================================================== */}
      {mobileMenuOpen && (
        <div className="ham-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className={`ham-dropdown${mobileMenuOpen ? ' open' : ''}`} data-lenis-prevent>
        <div className="ham-inner">
          {/* Col 1 — Products */}
          <div className="ham-col">
            <div className="ham-col-img-wrap">
              <img src="https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600&auto=format&fit=crop&q=80" alt="Our Products" />
            </div>
            <div className="ham-col-eyebrow">Our</div>
            <div className="ham-col-heading">Products</div>
            <a href="#new-arrivals" className="ham-col-shopall" onClick={() => setMobileMenuOpen(false)}>Shop All</a>
            <ul className="ham-col-links">
              <li><a href="#new-arrivals" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Blue Pottery</a></li>
              <li><a href="/textiles" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Ajrak Textiles</a></li>
              <li><a href="#new-arrivals" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Woodcarving</a></li>
              <li><a href="#new-arrivals" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Khussa Footwear</a></li>
              <li><a href="#new-arrivals" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Brass & Onyx</a></li>
              <li><a href="#new-arrivals" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Ralli Quilts</a></li>
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
              <li><a href="#instagram-section" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>The Hunarkar Journal</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>Provenance & Process</a></li>
              <li><a href="#" className="ham-col-link" onClick={() => setMobileMenuOpen(false)}>About Us</a></li>
            </ul>
          </div>
        </div>

        {/* Footer bar */}
        <div className="ham-footer-bar">
          <a href="#" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Customer Experience</a>
          <a href="#" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Sign up for Emails</a>
          <a href="#instagram-section" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Heritage Journal</a>
          <a href="https://wa.me/923000000000" target="_blank" rel="noreferrer" className="ham-footer-link">WhatsApp Us</a>
          <a href="#" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Privacy Notice</a>
          <a href="#" className="ham-footer-link" onClick={() => setMobileMenuOpen(false)}>Careers</a>
        </div>
      </div>

      {/* =====================================================
           HERO — Cinematic fullscreen
         ===================================================== */}
      <section id="hero">
        <div className="hero-media-container">
          <img
            src="/hk1.png"
            alt="Hunarkar artisan living collection"
            className={`hero-slide hero-slide-1${heroSlide === 0 ? ' active' : ''}`}
          />
          <img
            src="/hk2.png"
            alt="Hunarkar outdoor artisan collection"
            className={`hero-slide hero-slide-2${heroSlide === 1 ? ' active' : ''}`}
          />
          <img
            src="/hk3.avif"
            alt="Hunarkar contemporary interior collection"
            className={`hero-slide hero-slide-3${heroSlide === 2 ? ' active' : ''}`}
          />
        </div>
        <div className="hero-overlay" />
      </section>

      <main>
        {/* Hairline spacer between hero and first section */}
        <div style={{ height: '25px', background: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }} />

        {/* ===================================================
             PATRONS SAVINGS BANNER
           =================================================== */}
        <a href="#new-arrivals" className="patrons-banner">
          <div className="patrons-inner gsap-fade">
            <span className="patrons-eyebrow">HUNARKAR PATRONS</span>
            <h2 className="patrons-headline">
              <span className="patrons-save">SAVE 30%</span>
              {' '}<em className="patrons-on">on</em>{' '}
              <span className="patrons-cats">POTTERY,<br />TEXTILES &amp; WOODWORK</span>
            </h2>
            <p className="patrons-sub">FOR A LIMITED TIME</p>
            <span className="cta-link patrons-cta">Shop the Collection</span>
          </div>
        </a>

        {/* ===================================================
             SHOP THE ROOM — interactive hotspot section
           =================================================== */}
        <ShopTheRoom />

        {/* ===================================================
             BESPOKE INQUIRIES (Panel E / Espresso)
           =================================================== */}
        <section className="editorial-panel panel-espresso" id="bespoke-inquire">
          <span className="editorial-eyebrow">EXCLUSIVE ENGAGEMENTS</span>
          <h2 className="editorial-title">Bespoke Commissions</h2>
          <div className="editorial-body" style={{ maxWidth: '600px', textAlign: 'center', margin: '0 auto 2.5rem' }}>
            Collaborate directly with our master woodcarvers, potters, and weavers to construct bespoke designs customized for your residential or commercial scale. Formulate initial metrics, select custom wood grains or cobalt pigments, and review making logs direct from the workshop.
          </div>
          <div className="editorial-ctas" style={{ alignItems: 'center' }}>
            <button className="cta-link" onClick={() => setBespokeOpen(true)}>
              Inquire Custom Commission
            </button>
          </div>
        </section>

        {/* ===================================================
             NEW ARRIVALS — Product grid
           =================================================== */}
        <section id="new-arrivals" className="panel-linen" style={{ padding: '100px 8%', borderBottom: '1px solid var(--border)' }}>
          <div className="section-header-centered">
            <span className="editorial-eyebrow">CURATED HERITAGE</span>
            <h2 className="editorial-title" style={{ margin: '0 0 1rem' }}>New Arrivals</h2>
            <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
              Select handcarved and handpainted items curated for contemporary environments.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Showing in
            </span>
            <div
              className="currency-toggle"
              onClick={() => setCurrency(c => c === 'USD' ? 'PKR' : 'USD')}
              style={{ cursor: 'pointer' }}
            >
              <span className={currency === 'USD' ? 'active' : ''}>USD</span>
              <span className="currency-sep">|</span>
              <span className={currency === 'PKR' ? 'active' : ''}>PKR</span>
            </div>
          </div>

          <div className="product-grid">
            {products.length === 0 ? (
              /* Skeleton placeholders when no products loaded yet */
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="product-card" style={{ opacity: 0.4 }}>
                  <div className="product-img-wrap" style={{ background: 'var(--bg-mid)' }} />
                  <div className="product-card-body">
                    <div className="product-cat" style={{ background: 'var(--bg-mid)', height: '0.7rem', width: '40%', borderRadius: '2px' }} />
                    <div className="product-name" style={{ background: 'var(--bg-mid)', height: '1.4rem', width: '70%', borderRadius: '2px', marginTop: '0.5rem' }} />
                  </div>
                </div>
              ))
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className="product-card"
                  onClick={() => setQuickView(product)}
                >
                  {/* Wishlist */}
                  <button
                    className="product-wishlist"
                    id={`wishlist-${product.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`${product.name} saved to your wishlist.`);
                    }}
                    aria-label="Save to wishlist"
                  >
                    <i className="fa-regular fa-heart" />
                  </button>

                  {/* Image */}
                  <div className="product-img-wrap">
                    <SafeImg
                      src={product.img}
                      fallback={`https://picsum.photos/seed/${product.id}/600/800`}
                      alt={product.name}
                    />
                    {/* Certificate mini badge */}
                    <div className="cert-mini-badge">
                      <i className="fa-solid fa-stamp" /> Certified
                    </div>
                    <button
                      className="quick-add-btn"
                      id={`add-to-cart-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      Add to Bag
                    </button>
                  </div>

                  {/* Details */}
                  <div className="product-card-body">
                    <span className="product-cat">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-artisan">{product.artisan}</p>
                    <div className="product-price-row">
                      <span className="product-price">{formatPrice(product.usdPrice, product.pkrPrice)}</span>
                      <button
                        className="cta-link"
                        onClick={(e) => { e.stopPropagation(); setQuickView(product); }}
                        style={{ fontSize: '0.72rem', borderBottom: '1px solid currentColor', paddingBottom: '2px' }}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ===================================================
             INSTAGRAM JOURNAL
           =================================================== */}
        <section id="instagram-section" className="panel-espresso" style={{ padding: '100px 4%', borderBottom: '1px solid var(--border)' }}>
          <div className="instagram-header" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <a
              href="https://instagram.com/hunarkaar"
              target="_blank"
              rel="noreferrer"
              className="insta-handle"
              id="instagram-link"
              style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', borderBottom: '1px solid currentColor', paddingBottom: '3px' }}
            >
              <i className="fa-brands fa-instagram" /> @hunarkaar
            </a>
            <h2 className="editorial-title" style={{ marginTop: '1.5rem', marginBottom: '0' }}>Aesthetic Journal</h2>
          </div>
          <div className="instagram-grid">
            {INSTA_IMGS.map((item, i) => (
              <a
                key={i}
                href="https://instagram.com/hunarkaar"
                target="_blank"
                rel="noreferrer"
                className="instagram-item"
                id={`insta-item-${i + 1}`}
              >
                <SafeImg
                  src={`https://picsum.photos/seed/${item.seed}/600/600`}
                  alt={item.alt}
                />
                <div className="insta-hover-overlay">
                  <i className="fa-brands fa-instagram" />
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* =====================================================
           FOOTER
         ===================================================== */}
      <footer id="site-footer">
        <div className="footer-grid">
          {/* About */}
          <div>
            <a href="#" className="logo footer-logo">H<em>unarkar</em></a>
            <p className="footer-about-text">
              Preserving centuries-old heritage techniques by connecting Pakistan's
              master craftsmen directly with contemporary interiors worldwide.
            </p>
            <div className="social-links">
              <a href="https://instagram.com/hunarkaar" target="_blank" rel="noreferrer" id="footer-instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="#" id="footer-pinterest" aria-label="Pinterest">
                <i className="fa-brands fa-pinterest" />
              </a>
              <a href="#" id="footer-youtube" aria-label="YouTube">
                <i className="fa-brands fa-youtube" />
              </a>
              <a href="https://wa.me/923000000000" target="_blank" rel="noreferrer" id="footer-whatsapp" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="footer-col-title">Shop Collection</h4>
            <ul className="footer-links">
              <li><a href="#heritage-grid">Blue Pottery</a></li>
              <li><a href="#heritage-grid">Indigo Ajrak</a></li>
              <li><a href="#heritage-grid">Ralli Patchwork</a></li>
              <li><a href="#heritage-grid">Chinioti Woodwork</a></li>
              <li><a href="#heritage-grid">Fine Brassware</a></li>
              <li><a href="#heritage-grid">Onyx Crafts</a></li>
            </ul>
          </div>

          {/* Heritage */}
          <div>
            <h4 className="footer-col-title">Heritage</h4>
            <ul className="footer-links">
              <li><a href="#artisan-split">Meet the Maker</a></li>
              <li><a href="#process-section">Our Process</a></li>
              <li><a href="#bespoke-banner">Bespoke Orders</a></li>
              <li><a href="#">Impact & Fair Trade</a></li>
              <li><a href="#">Certificate of Authenticity</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer-col-title">Aesthetic Newsletter</h4>
            <p className="newsletter-desc">
              Join our global circle for exclusive artisan profiles, collection drops, and heritage logs.
            </p>
            <form
              id="newsletter-form"
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Welcome to the Hunarkar heritage circle.');
              }}
            >
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

      {/* =====================================================
           CART DRAWER
         ===================================================== */}
      {cartOpen && <div id="cart-overlay" onClick={() => setCartOpen(false)} />}
      <div
        id="cart-drawer"
        style={{ transform: cartOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="cart-header">
          <h3>Your Bag ({cartCount})</h3>
          <button className="close-btn" onClick={() => setCartOpen(false)}>
            Close <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <p className="cart-empty-message">Your bag is empty.</p>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id} id={`cart-item-${item.id}`}>
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
          <button
            className="btn-gold"
            id="checkout-btn"
            style={{ width: '100%' }}
            onClick={() => alert('Opening secure checkout...')}
          >
            Checkout Bag
          </button>
        </div>
      </div>

      {/* =====================================================
           SEARCH OVERLAY
         ===================================================== */}
      <div id="search-overlay" className={searchOpen ? 'open' : ''}>
        <button id="search-close-btn" className="search-close" onClick={() => setSearchOpen(false)}>
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="search-input-wrap">
          <i className="fa-solid fa-magnifying-glass search-icon" />
          <input
            id="search-input"
            type="text"
            placeholder="Search the heritage catalogue..."
            className="search-input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                alert(`Searching for: "${searchTerm}"`);
                setSearchOpen(false);
              }
            }}
            autoFocus={searchOpen}
          />
        </div>
        <div className="search-suggestions">
          {['Cobalt Vase', 'Walnut Box', 'Ajrak Scarf', 'Khussa Shoes', 'Brass Tray'].map(s => (
            <span
              key={s}
              className="suggestion-tag"
              onClick={() => {
                setSearchTerm(s);
                alert(`Searching for: "${s}"`);
                setSearchOpen(false);
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* =====================================================
           PRODUCT QUICK VIEW MODAL
         ===================================================== */}
      {quickView && (
        <div
          id="product-modal-overlay"
          onClick={() => setQuickView(null)}
        >
          <div className="product-modal" onClick={(e) => e.stopPropagation()} id="product-quick-view">
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
                id="pm-add-to-cart-btn"
                style={{ width: '100%', marginTop: '2.5rem' }}
                onClick={() => {
                  addToCart(quickView);
                  setQuickView(null);
                }}
              >
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
           BESPOKE COMMISSION MODAL
         ===================================================== */}
      {bespokeOpen && (
        <div id="modal-overlay" onClick={closeBespoke}>
          <div id="bespoke-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bespoke Commission</h3>
              <button className="close-btn" id="bespoke-close-btn" onClick={closeBespoke}>
                Close <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="modal-body">
              <form id="bespoke-form" onSubmit={handleBespokeSubmit}>
                {/* Step 1 */}
                {bespokeStep === 1 && (
                  <div className="form-step active">
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)', marginBottom: '1.8rem' }}>
                      Select Craft Profile
                    </h4>
                    <div className="form-group">
                      <label htmlFor="craftType">Heritage Artform</label>
                      <select
                        id="craftType"
                        className="form-select"
                        value={craftType}
                        onChange={(e) => setCraftType(e.target.value)}
                      >
                        <option>Blue Pottery (Multani Floral Clay)</option>
                        <option>Indigo Ajrak Block Printing</option>
                        <option>Ralli Applique Stitch Quilt</option>
                        <option>Chiniot Walnut Woodcarving</option>
                        <option>Hammered Fine Brassware</option>
                        <option>Green/Gold Onyx Masonry</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="dimensions">Dimensions / Space Context</label>
                      <textarea
                        id="dimensions"
                        rows={3}
                        className="form-textarea"
                        placeholder="e.g. 24×36 inch table top, custom oversized clay urn for living room..."
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
                {/* Step 2 */}
                {bespokeStep === 2 && (
                  <div className="form-step active">
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)', marginBottom: '1.8rem' }}>
                      Your Contact Info
                    </h4>
                    <div className="form-group">
                      <label htmlFor="userName">Full Name</label>
                      <input id="userName" type="text" className="form-input" placeholder="Your Name"
                        value={userName} onChange={(e) => setUserName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="userEmail">Email Address</label>
                      <input id="userEmail" type="email" className="form-input" placeholder="your@email.com"
                        value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="userWA">WhatsApp Number</label>
                      <input id="userWA" type="text" className="form-input" placeholder="+92 300 1234567"
                        value={userWA} onChange={(e) => setUserWA(e.target.value)} required />
                    </div>
                  </div>
                )}
                <div className="form-navigation">
                  {bespokeStep > 1 ? (
                    <button type="button" className="btn-outline" id="bespoke-back-btn" onClick={() => setBespokeStep(1)}>
                      ← Back
                    </button>
                  ) : <div />}
                  {bespokeStep < 2 ? (
                    <button
                      type="button"
                      id="bespoke-next-btn"
                      className="btn-gold"
                      onClick={() => dimensions.trim() ? setBespokeStep(2) : alert('Please describe your project.')}
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button type="submit" id="bespoke-submit-btn" className="btn-gold">
                      <i className="fa-brands fa-whatsapp" /> Submit via WhatsApp
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
