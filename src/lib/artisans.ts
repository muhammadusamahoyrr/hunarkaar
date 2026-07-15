/* ============================================================
   ARTISANS — the registry behind /artisans/[slug]

   Every product already carried an `artisan` string; until now it
   linked nowhere. This turns it into a join key.

   Two deliberate shapes:

   1. Process steps hang off the CRAFT, not the person. How Chiniot
      walnut is seasoned and carved is true of every Chiniot carver —
      duplicating it per artisan would be both a lie and 19x the copy.
      The person supplies the ledger, the portrait and the statement.

   2. Products join by a tolerant matcher, not string equality. The DB
      seeds "Master Carver Khurshid Alam, Chiniot Studio" while
      localProducts says "Khurshid Alam, Chiniot Studio" — the same man.
      An exact join would silently split him into two artisans.

   ⚠ PORTRAITS AND LEDGER FIGURES ARE PLACEHOLDER. This page's whole
   claim is provenance; stock portraits of strangers actively undermine
   it. Swap in real photography and real numbers before this ships.
   ============================================================ */

import type { ProductItem } from './siteData';

/* The exact values the bespoke modal's craft <select> accepts. These strings
   must stay in step with the <option> list in SiteShell (and Homepage), or the
   prefill silently falls back to the first option — which is how commissioning
   a leather artisan once opened a form that said "Blue Pottery". */
export type BespokeCraft =
  | 'Blue Pottery (Multani Floral Clay)'
  | 'Indigo Ajrak Block Printing'
  | 'Ralli Applique Stitch Quilt'
  | 'Chiniot Walnut Woodcarving'
  | 'Hammered Fine Brassware'
  | 'Green/Gold Onyx Masonry'
  | 'Leather Weaving & Saddlery'
  | 'Palm, Rattan & Cane'
  | 'Zardozi Khussa';

export interface ProcessStep {
  title: string;
  body: string;
}

export interface Craft {
  key: string;
  label: string;          // "Walnut woodcarving"
  discipline: string;     // shown under the name in the rail
  steps: ProcessStep[];
  bespoke?: BespokeCraft;
}

export interface Artisan {
  slug: string;
  name: string;
  studio: string;
  city: string;
  region: string;
  craft: string;          // → CRAFTS key
  statement: string;      // pull quote, first person
  portrait: string;

  /* Ledger */
  since: number;
  generation: string;
  leadTime: string;
  apprentices: number;

  /* Lowercased fragments; a product belongs to this artisan if any
     fragment appears in its (lowercased) artisan string. */
  match: string[];
}

/* ============================================================
   CRAFTS — the process ladders
   ============================================================ */

export const CRAFTS: Record<string, Craft> = {
  woodcarving: {
    key: 'woodcarving',
    label: 'Walnut woodcarving',
    discipline: 'Woodcarving',
    bespoke: 'Chiniot Walnut Woodcarving',
    steps: [
      { title: 'Seasoning',       body: 'Wild walnut is felled in winter and then rested in shade for two years. Wood cut green will keep moving for the rest of its life.' },
      { title: 'The naqsha',      body: 'The motif is drawn straight onto the board in white chalk. No stencil, no transfer — the pattern lives in the carver’s hand.' },
      { title: 'Chiselling',      body: 'Forty-odd chisels, each ground for a single curve. The relief is cut at three depths, so that the light has something to fall into.' },
      { title: 'Joinery',         body: 'Mortise and tenon, cut dry and driven home. No metal fastener enters the piece.' },
      { title: 'Oiling',          body: 'Seven coats of linseed, a week apart, each one rubbed back by hand before the next.' },
    ],
  },

  leather: {
    key: 'leather',
    label: 'Leather weaving & saddlery',
    discipline: 'Leatherwork',
    bespoke: 'Leather Weaving & Saddlery',
    steps: [
      { title: 'Pit tanning',     body: 'Hides are tanned with babul bark over six weeks. Chrome tanning takes a day — it also takes the smell, and the patina.' },
      { title: 'Cutting',         body: 'Strips are cut along the spine of the hide, where the grain is tightest and the stretch is least.' },
      { title: 'The weave',       body: 'Strips are woven wet over the frame and left to dry taut. The tension is set by hand and cannot be corrected afterwards.' },
      { title: 'Saddle stitch',   body: 'Two needles, one waxed linen thread. A machine lock-stitch unravels the moment it is cut; this does not.' },
      { title: 'Finishing',       body: 'Beeswax and neatsfoot oil, worked in warm. The colour goes on deepening for years.' },
    ],
  },

  weaving: {
    key: 'weaving',
    label: 'Kilim & handloom weaving',
    discipline: 'Weaving',
    bespoke: 'Ralli Applique Stitch Quilt',
    steps: [
      { title: 'Dyeing the yarn', body: 'Wool and cotton are dyed in open copper vats — madder for red, pomegranate rind for yellow, indigo for blue.' },
      { title: 'Dressing the loom', body: 'The warp is measured and strung by hand. A bench-width kilim takes two days to dress before a single weft is laid.' },
      { title: 'Slit-weave',      body: 'The weft is packed down with an iron comb, row upon row. A hand’s width is a good day’s work.' },
      { title: 'The ends',        body: 'Warp ends are knotted and braided by hand — never cut short and glued.' },
      { title: 'Washing',         body: 'Washed in running water, then stretched on a frame in the sun to set the weave.' },
    ],
  },

  cane: {
    key: 'cane',
    label: 'Palm, rattan & cane',
    discipline: 'Cane weaving',
    bespoke: 'Palm, Rattan & Cane',
    steps: [
      { title: 'Harvest',         body: 'Palm and rattan are cut in the dry months, when the sap is down and the cane will not shrink later.' },
      { title: 'Splitting',       body: 'Each length is split by eye into strands of even thickness. One thick strand shows in the weave forever.' },
      { title: 'Soaking',         body: 'Strands are soaked until they will take a bend without cracking, then worked while still wet.' },
      { title: 'The seat',        body: 'Woven over the frame under constant tension. The pattern is counted, never drawn.' },
      { title: 'Curing',          body: 'Dried slowly in shade. Sun-drying is quicker, and leaves the cane brittle.' },
    ],
  },

  pottery: {
    key: 'pottery',
    label: 'Multani blue pottery',
    discipline: 'Blue pottery',
    bespoke: 'Blue Pottery (Multani Floral Clay)',
    steps: [
      { title: 'The body',        body: 'Not clay in the usual sense — quartz, fuller’s earth and gum, ground and kneaded. It is closer to glass than to earthenware.' },
      { title: 'Forming',         body: 'Thrown or pressed, then left to leather-hard and scraped smooth.' },
      { title: 'Painting',        body: 'Cobalt and copper oxide, ground on stone and laid on with a squirrel-hair brush. A stroke cannot be taken back.' },
      { title: 'Glazing',         body: 'Dipped in a raw glaze the colour of milk. The blue vanishes completely, and does not return until the fire.' },
      { title: 'The fire',        body: 'One firing, 800°C, twelve hours. A tenth of every kiln is lost, and that tenth is the price of the rest.' },
    ],
  },

  blockprint: {
    key: 'blockprint',
    label: 'Ajrak block printing',
    discipline: 'Block printing',
    bespoke: 'Indigo Ajrak Block Printing',
    steps: [
      { title: 'Saaj',            body: 'The cloth is steeped overnight in castor oil, soda ash and camel dung. It is the smell that everyone remembers.' },
      { title: 'Kasanoo',         body: 'Steeped in myrobalan. The cloth turns the colour of straw, and learns how to hold a dye.' },
      { title: 'The resist',      body: 'Hand-carved teak blocks lay down lime and gum wherever the dye must not reach. Registration is by eye alone.' },
      { title: 'Indigo',          body: 'Dipped in a fermented vat and lifted into the air, where it turns from yellow-green to blue in front of you.' },
      { title: 'The river',       body: 'Washed in running water and beaten on stone. Fourteen stages, three weeks — and both faces come out identical.' },
    ],
  },

  brass: {
    key: 'brass',
    label: 'Hand-beaten brasswork',
    discipline: 'Brasswork',
    bespoke: 'Hammered Fine Brassware',
    steps: [
      { title: 'Annealing',   body: 'The sheet goes into the coals until it glows dull red. Brass work-hardens under the hammer; the fire is what keeps it willing.' },
      { title: 'Raising',     body: 'Ten thousand overlapping strikes over an iron stake, each one a millimetre from the last. The form rises out of the flat sheet like a bowl out of water.' },
      { title: 'Piercing',    body: 'The pattern is punched from the inside with a graver and mallet — no drill, no template. Every pierced star is one strike, and a strike cannot be unstruck.' },
      { title: 'Qalai',       body: 'Molten tin is wiped across the inner surface with a cotton pad, the old food-safe lining of the subcontinent. It flashes silver in seconds.' },
      { title: 'Burnishing',  body: 'Tamarind pulp and ash, rubbed by hand until the metal takes a soft, deep lustre. Lacquer would be faster, and worse.' },
    ],
  },

  khussa: {
    key: 'khussa',
    label: 'Zardozi khussa',
    discipline: 'Khussa & zardozi',
    bespoke: 'Zardozi Khussa',
    steps: [
      { title: 'Cutting',         body: 'Buffalo hide for the sole, goat for the upper. The sole is cut in a single piece.' },
      { title: 'Zardozi',         body: 'Gold-wrapped thread is couched onto the upper on a wooden frame, worked from behind with a hooked needle.' },
      { title: 'Lasting',         body: 'The upper is stretched over a wooden last and left to take its shape.' },
      { title: 'Stitching',       body: 'Sole to upper with cotton thread through pre-pricked holes. No nails, no glue.' },
      { title: 'Beating',         body: 'The finished shoe is beaten on stone until it softens. Khussa have no left and no right — they learn the foot.' },
    ],
  },
};

/* ============================================================
   ARTISANS
   ============================================================ */

/* Placeholder portraits — see the warning at the top of this file. */
const P = (id: string) =>
  `https://images.unsplash.com/${id}?w=560&h=700&auto=format&fit=crop&crop=faces%2Cfocal&q=80`;

export const ARTISANS: Artisan[] = [
  {
    slug: 'ustad-noor-ahmad', name: 'Ustad Noor Ahmad', studio: 'Noor Leather Works',
    city: 'Lahore', region: 'Punjab', craft: 'leather',
    statement: 'A strip cut across the grain will look the same on the day you buy it. Come back in ten years and it will have told on me.',
    portrait: P('photo-1590605095243-072811dbe64c'),
    since: 1987, generation: '3rd', leadTime: '4–6 weeks', apprentices: 2,
    match: ['ustad noor ahmad'],
  },
  {
    slug: 'khurshid-alam', name: 'Khurshid Alam', studio: 'Chiniot Studio',
    city: 'Chiniot', region: 'Punjab', craft: 'woodcarving',
    statement: 'My grandfather cut the doors of houses that are still standing. I am not making furniture. I am making something that outlives the buyer.',
    portrait: P('photo-1606744824163-985d376605aa'),
    since: 1979, generation: '4th', leadTime: '8–10 weeks', apprentices: 5,
    match: ['khurshid alam'],
  },
  {
    slug: 'mai-fatima', name: 'Mai Fatima', studio: 'Bhit Shah Handloom',
    city: 'Bhit Shah', region: 'Sindh', craft: 'weaving',
    statement: 'The loom does not hurry. You sit down at it in the morning and you get a hand’s width, and that is the day.',
    portrait: P('photo-1594040226829-7f251ab46d80'),
    since: 1994, generation: '2nd', leadTime: '3–5 weeks', apprentices: 4,
    match: ['mai fatima'],
  },
  {
    slug: 'haji-sardar', name: 'Haji Sardar', studio: 'Quetta Collective',
    city: 'Quetta', region: 'Balochistan', craft: 'cane',
    statement: 'Palm is cheap and everyone thinks it is easy. Split it badly once and the whole seat is wrong, and you will see it every day.',
    portrait: P('photo-1621506821957-1b50ab7787a4'),
    since: 1991, generation: '1st', leadTime: '2–3 weeks', apprentices: 3,
    match: ['haji sardar'],
  },
  {
    slug: 'master-iqbal', name: 'Master Iqbal', studio: 'Rawalpindi Workshop',
    city: 'Rawalpindi', region: 'Punjab', craft: 'woodcarving',
    statement: 'No screw, no nail, no glue that I did not boil myself. If a joint fails, it fails on me.',
    portrait: P('photo-1567538096630-e0c55bd6374c'),
    since: 1984, generation: '2nd', leadTime: '6–8 weeks', apprentices: 3,
    match: ['master iqbal'],
  },
  {
    slug: 'gohar-bibi', name: 'Gohar Bibi', studio: 'Sindh Craft Council',
    city: 'Hyderabad', region: 'Sindh', craft: 'cane',
    statement: 'We are eleven women and one loom shed. Everything that leaves here has four or five pairs of hands in it.',
    portrait: P('photo-1555252333-9f8e92e65df9'),
    since: 2003, generation: '1st', leadTime: '2–4 weeks', apprentices: 11,
    match: ['gohar bibi'],
  },
  {
    slug: 'aziz-furniture-house', name: 'Aziz Furniture House', studio: 'Aziz Furniture House',
    city: 'Lahore', region: 'Punjab', craft: 'woodcarving',
    statement: 'Mango wood is the honest wood. It moves a little, it marks a little, and it does not pretend to be teak.',
    portrait: P('photo-1691036561573-4b76998b60de'),
    since: 1998, generation: '2nd', leadTime: '5–7 weeks', apprentices: 6,
    match: ['aziz furniture'],
  },
  {
    slug: 'ghulam-nabi', name: 'Ghulam Nabi', studio: 'Karachi Saddar',
    city: 'Karachi', region: 'Sindh', craft: 'leather',
    statement: 'Full-grain, or do not call it leather. The scars stay in it. That is how you know the animal was real.',
    portrait: P('photo-1608256246200-53e635b5b65f'),
    since: 1989, generation: '3rd', leadTime: '4–5 weeks', apprentices: 2,
    match: ['ghulam nabi'],
  },
  {
    slug: 'amina-textiles', name: 'Amina Textiles', studio: 'Amina Textiles',
    city: 'Multan', region: 'Punjab', craft: 'weaving',
    statement: 'We buy kilim off looms that are older than the country, and we build the bench around the cloth — never the other way round.',
    portrait: P('photo-1600166898405-da9535204843'),
    since: 2001, generation: '1st', leadTime: '3–4 weeks', apprentices: 7,
    match: ['amina textiles'],
  },
  {
    slug: 'sajida-looms', name: 'Sajida Looms', studio: 'Sajida Looms',
    city: 'Hyderabad', region: 'Sindh', craft: 'weaving',
    statement: 'Jute was the poor thread. Now everybody wants it, and they want it to look poor on purpose.',
    portrait: P('photo-1773842298512-e49c9331cc3d'),
    since: 2006, generation: '1st', leadTime: '2–3 weeks', apprentices: 5,
    match: ['sajida looms'],
  },
  {
    slug: 'tariq-woodworks', name: 'Tariq Woodworks', studio: 'Tariq Woodworks',
    city: 'Gujranwala', region: 'Punjab', craft: 'woodcarving',
    statement: 'A stool out of one piece of teak. Anyone can join four legs to a board — try taking it out of a single block and leaving nothing behind.',
    portrait: P('photo-1594026112284-02bb6f3352fe'),
    since: 1996, generation: '2nd', leadTime: '3–4 weeks', apprentices: 2,
    match: ['tariq woodworks'],
  },
  {
    slug: 'ustad-bashir', name: 'Ustad Bashir', studio: 'Sialkot Leather Guild',
    city: 'Sialkot', region: 'Punjab', craft: 'leather',
    statement: 'Sialkot makes footballs for the world and nobody knows our name. On this bench, at least, my name is on it.',
    portrait: P('photo-1507473885765-e6ed057f782c'),
    since: 1982, generation: '3rd', leadTime: '5–6 weeks', apprentices: 4,
    match: ['ustad bashir'],
  },
  {
    slug: 'zubeda-craft-house', name: 'Zubeda Craft House', studio: 'Zubeda Craft House',
    city: 'Lahore', region: 'Punjab', craft: 'weaving',
    statement: 'Every bench is a different cloth, so every bench is a different bench. I cannot make you two the same, and I would not want to.',
    portrait: P('photo-1779470703519-05af825e87cd'),
    since: 1999, generation: '2nd', leadTime: '4–6 weeks', apprentices: 8,
    match: ['zubeda craft house'],
  },
  {
    slug: 'mukhtar-rattan-arts', name: 'Mukhtar Rattan Arts', studio: 'Mukhtar Rattan Arts',
    city: 'Peshawar', region: 'Khyber Pakhtunkhwa', craft: 'cane',
    statement: 'Rattan is a rope that has decided to be a tree. Work with it wet and it will do anything you ask.',
    portrait: P('photo-1558171813-2c882dddbd46'),
    since: 1993, generation: '2nd', leadTime: '3–4 weeks', apprentices: 4,
    match: ['mukhtar rattan'],
  },
  {
    slug: 'fazal-ahmad', name: 'Fazal Ahmad', studio: 'Chiniot Master Guild',
    city: 'Chiniot', region: 'Punjab', craft: 'woodcarving',
    statement: 'The guild will not let a piece out with a machine cut in it. We have thrown away work that the buyer would never have noticed.',
    portrait: P('photo-1616137466211-f939a420be84'),
    since: 1986, generation: '5th', leadTime: '8–12 weeks', apprentices: 6,
    match: ['fazal ahmad'],
  },
  {
    slug: 'rasheed-furniture', name: 'Rasheed Furniture Co.', studio: 'Rasheed Furniture Co.',
    city: 'Rawalpindi', region: 'Punjab', craft: 'cane',
    statement: 'The spiral has to close on itself exactly. If it is out by one strand at the start, it is out by a finger’s width at the end.',
    portrait: P('photo-1564078516393-cf04bd966897'),
    since: 2000, generation: '1st', leadTime: '3–5 weeks', apprentices: 3,
    match: ['rasheed furniture'],
  },
  {
    slug: 'ustad-shamil-raza', name: 'Ustad Shamil Raza', studio: 'Multani Blue Art',
    city: 'Multan', region: 'Punjab', craft: 'pottery',
    statement: 'You paint it grey and you glaze it white and you put it in the fire not knowing. Twelve hours later the kiln tells you whether you are a potter.',
    portrait: P('photo-1610701596007-11502861dcfa'),
    since: 1988, generation: '6th', leadTime: '4–6 weeks', apprentices: 3,
    match: ['shamil raza'],
  },
  {
    slug: 'mai-bakhtawar', name: 'Mai Bakhtawar', studio: 'Bhit Shah Handloom',
    city: 'Bhit Shah', region: 'Sindh', craft: 'blockprint',
    statement: 'Fourteen stages, and the cloth spends more of it in the river than in my hands.',
    /* Content-verified: woman in handwoven silk. The previous ID rendered as
       a canvas tote bag. Keep in sync with IMG_PORTRAIT in CategoryPage. */
    portrait: P('photo-1610030469983-98e550d6193c'),
    since: 1992, generation: '4th', leadTime: '3–4 weeks', apprentices: 5,
    match: ['mai bakhtawar'],
  },
  {
    slug: 'mohammad-din', name: 'Mohammad Din', studio: 'Rawalpindi Saddar Bazaar',
    city: 'Rawalpindi', region: 'Punjab', craft: 'khussa',
    statement: 'They come back stiff and they go home soft. A khussa is not finished by me — it is finished by the person wearing it.',
    portrait: P('photo-1596462502278-27bfdc403348'),
    since: 1990, generation: '3rd', leadTime: '2–3 weeks', apprentices: 2,
    /* Fragment includes the studio: the catalogue carries a second, unrelated
       Mohammad Din at the Rawalpindi Brass Guild, and a bare name match sent
       his lanterns to this shoemaker's dossier. */
    match: ['mohammad din, rawalpindi saddar'],
  },
  {
    slug: 'mohammad-din-brass', name: 'Mohammad Din', studio: 'Rawalpindi Brass Guild',
    city: 'Rawalpindi', region: 'Punjab', craft: 'brass',
    statement: 'Anyone can make brass shine. The guild trade is the piercing — when the lamp is lit, the wall shows you every place my hand hesitated.',
    portrait: P('photo-1550985616-10810253b84d'),
    since: 1985, generation: '4th', leadTime: '3–5 weeks', apprentices: 4,
    match: ['mohammad din, rawalpindi brass', 'rawalpindi brass guild'],
  },
];

/* ============================================================
   RESOLVERS
   ============================================================ */

export function getArtisanBySlug(slug: string): Artisan | undefined {
  return ARTISANS.find(a => a.slug === slug);
}

export function getCraft(artisan: Artisan): Craft {
  return CRAFTS[artisan.craft];
}

/** Tolerant join: "Master Carver Khurshid Alam, Chiniot Studio" → khurshid-alam */
export function getArtisanForProduct(artisanString: string): Artisan | undefined {
  const hay = artisanString.toLowerCase();
  return ARTISANS.find(a => a.match.some(m => hay.includes(m)));
}

/** Slug for a product's artisan string, or null when nobody claims it. */
export function artisanSlugFor(artisanString: string): string | null {
  return getArtisanForProduct(artisanString)?.slug ?? null;
}

/** Every product in `pool` made by this artisan. */
export function productsByArtisan<T extends Pick<ProductItem, 'artisan'>>(
  artisan: Artisan,
  pool: T[],
): T[] {
  return pool.filter(p => {
    const hay = p.artisan?.toLowerCase() ?? '';
    return artisan.match.some(m => hay.includes(m));
  });
}
