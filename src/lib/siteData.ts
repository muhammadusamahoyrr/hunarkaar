/* ============================================================
   SHARED SITE DATA — types, nav menus, helpers
   Used by SiteShell, CategoryPage, and potentially Homepage
   ============================================================ */

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  usdPrice: number;
  pkrPrice: number;
  img: string;
  description: string;
  artisan: string;
}

export interface CartItem extends ProductItem {
  quantity: number;
}

export type NavLink    = { label: string; isNew?: boolean; img?: string };
export type NavSection = { heading?: string; links: NavLink[] };
export type NavMenu    = {
  tagline?: string;
  defaultImg: string;
  portraitImg: string;
  featured: { name: string; craft: string };
  editImg2: string;
  caption1: string;
  caption2: string;
  popularLabel?: string;
  sections: NavSection[];
};

export const IMG     = (id: string) => `https://images.unsplash.com/${id}?w=600&auto=format&fit=crop&q=80`;
export const PORTRAIT = (id: string) => `https://images.unsplash.com/${id}?w=400&h=600&auto=format&fit=crop&crop=faces%2Cfocal&q=80`;
export const PORTEDIT = (id: string) => `https://images.unsplash.com/${id}?w=400&h=520&auto=format&fit=crop&crop=faces%2Cfocal&q=80`;

export const NAV_MENUS: Record<string, NavMenu> = {
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
  Décor: {
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
      { label: 'Incense & Diyas' },
      { label: 'Wall Art' },
    ]}],
  },
  'Baby & Child': {
    tagline: 'Gentle on skin, rich in tradition.',
    defaultImg: IMG('photo-1555252333-9f8e92e65df9'),
    portraitImg: PORTRAIT('photo-1555252333-9f8e92e65df9'),
    featured: { name: 'Cotton Kantha Crib Quilt', craft: 'Hand-stitched reversible cotton' },
    editImg2: PORTEDIT('photo-1596462502278-27bfdc403348'),
    caption1: 'Gentle Heritage',
    caption2: 'Made for Little Ones',
    popularLabel: 'Parent Picks',
    sections: [{ links: [
      { label: 'Crib Quilts & Ralli' },
      { label: 'Soft Wooden Toys' },
      { label: 'Baby Khussa' },
      { label: 'Embroidered Bibs', isNew: true },
      { label: 'Nursery Décor' },
    ]}],
  },
  Teen: {
    tagline: 'Contemporary craft for the next generation.',
    defaultImg: IMG('photo-1558171813-2c882dddbd46'),
    portraitImg: PORTRAIT('photo-1558171813-2c882dddbd46'),
    featured: { name: 'Block-Print Canvas Tote', craft: 'Indigo resist-dyed cotton canvas' },
    editImg2: PORTEDIT('photo-1621184455862-c163dfb30e0f'),
    caption1: 'Craft Meets Cool',
    caption2: 'Teen Picks',
    popularLabel: 'Teen Trends',
    sections: [{ links: [
      { label: 'Tote Bags' },
      { label: 'Block-Print Tees', isNew: true },
      { label: 'Ajrak Scrunchies' },
      { label: 'Ceramic Mugs' },
      { label: 'Embroidered Caps' },
    ]}],
  },
  Sale: {
    tagline: 'Exceptional craft at reduced prices — limited time only.',
    defaultImg: IMG('photo-1558618666-fcd25c85cd64'),
    portraitImg: PORTRAIT('photo-1558618666-fcd25c85cd64'),
    featured: { name: 'Select Pieces — Up to 40% Off', craft: 'All categories, while stocks last' },
    editImg2: PORTEDIT('photo-1596462502278-27bfdc403348'),
    caption1: 'The Heritage Sale',
    caption2: 'Last Pieces',
    popularLabel: 'Best Value',
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

export const NAV_ITEMS: Array<{ name: string; extraClass?: string }> = [
  { name: 'Estates' },
  { name: 'Living' },
  { name: 'Dining' },
  { name: 'Bed' },
  { name: 'Bath' },
  { name: 'Outdoor' },
  { name: 'Lighting' },
  { name: 'Textiles' },
  { name: 'Rugs' },
  { name: 'Décor' },
  { name: 'Baby & Child', extraClass: 'nav-baby-child' },
  { name: 'Teen',         extraClass: 'nav-baby-child' },
  { name: 'Sale',         extraClass: 'nav-sale' },
];
