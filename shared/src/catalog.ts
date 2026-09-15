import type { Collection, Product, Review } from "./types";

const now = "2026-09-01T00:00:00.000Z";

export const collections: Collection[] = [
  {
    id: "c1",
    slug: "timeless-gold",
    name: "Timeless Gold",
    tagline: "Solid warmth for everyday reverence",
    description:
      "Crafted in 18-karat yellow gold and heavy vermeil. Smooth forms that catch natural light with sculptural clarity.",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85",
    featured: true,
  },
  {
    id: "c2",
    slug: "the-pearl-edit",
    name: "The Pearl Edit",
    tagline: "Unregulated organic luster",
    description:
      "Sustainably harvested freshwater and baroque pearls, individually hand-knotted on pure silk cord with custom gold closures.",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85",
    featured: true,
  },
  {
    id: "c3",
    slug: "silver-moon",
    name: "Silver Moon",
    tagline: "Satin textures under pale light",
    description:
      "925 sterling silver finished with an artisanal satin brush. Cool, quiet, and engineered to age gracefully.",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85",
    featured: true,
  },
  {
    id: "c4",
    slug: "atelier-heritage",
    name: "Atelier Heritage",
    tagline: "Ceremonial weight without convention",
    description:
      "Intricate hand-set uncut stones, filigree borders, and antique gold tones born in our Bengaluru master workshop.",
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1600&q=85",
    featured: true,
  },
];

export const catalog: Product[] = [
  {
    id: "p1",
    slug: "nila-pearl-necklace",
    name: "Nila Pearl Necklace",
    subtitle: "Lustrous freshwater pearls on 18k solid gold clasp",
    description:
      "A quiet strand of hand-selected freshwater pearls on a custom gold-filled lobster clasp. Each pearl carries individual surface character and natural luminescence.",
    story:
      "Inspired by the gentle evening tides of Kerala's backwaters, the Nila necklace balances traditional Indian grace with modern Scandinavian restraint.",
    price: 14800,
    discountedPrice: 12800,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "necklaces",
    material: "18k Gold Vermeil & AA+ Freshwater Pearls",
    weight: "18 g",
    dimensions: "42 cm length + 5 cm extension",
    careInstructions:
      "Wipe clean with a soft microfiber cloth after wear. Store away from direct sunlight and perfumes.",
    inStock: true,
    featured: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 38,
    collectionSlug: "the-pearl-edit",
    variants: [
      { id: "v1-1", name: "16 inch / 40 cm", inStock: true },
      { id: "v1-2", name: "18 inch / 45 cm", inStock: true },
      { id: "v1-3", name: "20 inch / 50 cm", inStock: true },
    ],
    details: [
      "Individually hand-knotted on japanese silk cord",
      "Signature solid hallmarked clasp",
      "Hypoallergenic and nickel-free",
      "Delivered in our suede keepsake jewelry box",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p2",
    slug: "aruna-hoop-earrings",
    name: "Aruna Sculpted Hoops",
    subtitle: "Fluid tapered hoops with hand-brushed satin luster",
    description:
      "Sculpted thick hoops hollowed precisely for featherlight all-day wear. An organic tapered silhouette that contours the jawline with subtle architectural presence.",
    story:
      "Aruna translates to the first rays of dawn. Designed to catch morning light with gentle diffusions rather than harsh mirror reflections.",
    price: 6800,
    discountedPrice: 5400,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "earrings",
    material: "18k Heavy Gold Vermeil (3.0 microns)",
    weight: "5.8 g pair",
    dimensions: "24 mm outer diameter, 6 mm max width",
    inStock: true,
    featured: true,
    isNew: false,
    rating: 5.0,
    reviewCount: 44,
    collectionSlug: "timeless-gold",
    variants: [
      { id: "v2-1", name: "Classic 24mm", inStock: true },
      { id: "v2-2", name: "Petite 18mm", inStock: true },
    ],
    details: [
      "Hollow core engineering for featherlight comfort",
      "Secure hinge-click closure that stays firm",
      "Water-resistant gold vermeil plating",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p3",
    slug: "kiran-signet-ring",
    name: "Kiran Satin Signet",
    subtitle: "Oval heirloom signet in heavy sterling silver & gold plate",
    description:
      "An oval signet ring featuring a hand-brushed satin face bordered by a mirror-polished chamfer. Substantial in weight and engineered for everyday permanence.",
    story:
      "A tribute to classic bespoke signets, pared down to its cleanest geometric essence. Ready for future monogram engraving or to wear in pure minimalism.",
    price: 9400,
    discountedPrice: 8900,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "rings",
    material: "925 Sterling Silver with 18k Gold Dip",
    weight: "8.2 g",
    dimensions: "Face: 14 mm × 11 mm",
    inStock: true,
    featured: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 29,
    collectionSlug: "silver-moon",
    variants: [
      { id: "v3-1", name: "US 6 / IN 12", inStock: true },
      { id: "v3-2", name: "US 7 / IN 14", inStock: true },
      { id: "v3-3", name: "US 8 / IN 16", inStock: true },
      { id: "v3-4", name: "US 9 / IN 18", inStock: true },
    ],
    details: [
      "Solid cast core — no hollow backing",
      "Comfort-fit tapered inner band",
      "Includes polishing cloth and protective pouch",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p4",
    slug: "meera-chain-bracelet",
    name: "Meera Figaro Chain",
    subtitle: "Precision Italian figaro link in warm 18k vermeil",
    description:
      "A fine 3.2mm figaro link chain with seamless soldered links and a custom curved lobster clasp. Drapes naturally against the wrist and stacks effortlessly.",
    story:
      "Named after the legendary mystic poet Meera, this piece represents continuous rhythm, fluid beauty, and timeless resilience.",
    price: 4800,
    discountedPrice: 4200,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "bracelets",
    material: "18k Gold Vermeil over 925 Silver",
    weight: "7.8 g",
    dimensions: "17 cm length + 3 cm extension",
    inStock: true,
    featured: false,
    isNew: false,
    rating: 4.9,
    reviewCount: 19,
    collectionSlug: "timeless-gold",
    variants: [
      { id: "v4-1", name: "Small (16-18 cm)", inStock: true },
      { id: "v4-2", name: "Standard (18-20 cm)", inStock: true },
    ],
    details: [
      "Italian-made link geometry",
      "Tarnish-resistant protective nano-seal",
      "Zero pull on skin or fine fabrics",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p5",
    slug: "tara-moon-pendant",
    name: "Tara Crescent Pendant",
    subtitle: "Minimalist celestial pendant with satin textured crescent",
    description:
      "A delicate crescent medallion on a shimmering fine cable chain. Subtle brushed relief that catches subtle ambient glimmers without loud sparkle.",
    story:
      "Tara is both the Sanskrit word for star and the goddess of guided passage. An intimate token for daily quiet intention.",
    price: 6800,
    discountedPrice: 6100,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "pendants",
    material: "925 Sterling Silver with Rhodium finish",
    weight: "4.5 g",
    dimensions: "Pendant: 14 mm, Chain: 45 cm",
    inStock: true,
    featured: false,
    isNew: true,
    rating: 4.7,
    reviewCount: 16,
    collectionSlug: "silver-moon",
    variants: [
      { id: "v5-1", name: "Sterling Silver", inStock: true },
      { id: "v5-2", name: "18k Warm Gold", inStock: true },
    ],
    details: [
      "Rhodium dipped to prevent silver oxidation",
      "Diamond-cut cable chain with 3 adjustment loops",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p6",
    slug: "saheli-bridal-set",
    name: "Saheli Heritage Choker & Earrings Set",
    subtitle: "Antique 22k gold tone with hand-set Kundan glass & pearl drops",
    description:
      "A ceremonial choker and chandelier earring ensemble crafted with heritage jadau technique. Subtle antique matte patina balances dramatic visual opulence.",
    story:
      "Created in dialogue with fifth-generation craftsmen in Jaipur. High ceremonial drama re-engineered for light neck comfort and modern styling versatility.",
    price: 26500,
    discountedPrice: 22800,
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "sets",
    material: "22k Gold Plated Brass, Kundan Glass, Seed Pearls",
    weight: "58 g total",
    dimensions: "Choker: adjustable dori, Earrings: 5.5 cm drop",
    inStock: true,
    featured: true,
    isNew: false,
    rating: 5.0,
    reviewCount: 31,
    collectionSlug: "atelier-heritage",
    variants: [
      { id: "v6-1", name: "Emerald Accent", inStock: true },
      { id: "v6-2", name: "Ruby Accent", inStock: true },
      { id: "v6-3", name: "Pristine Pearl", inStock: true },
    ],
    details: [
      "Includes choker, jhumka earrings, and gift certificate",
      "Hand-braided gold zari tie back cord",
      "Velvet-lined heirloom wooden chest included",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p7",
    slug: "leila-emerald-cut-ring",
    name: "Leila Emerald Solitaire Ring",
    subtitle: "Lab-grown Columbian-hue emerald on knife-edge band",
    description:
      "An architectural emerald-cut simulated gemstone set in four sharp claw prongs atop a 1.8mm knife-edge band. Modern restraint meets vivid color depth.",
    story:
      "Engineered to sit flush against both straight wedding bands and curving eternity bands for effortless curation.",
    price: 13500,
    discountedPrice: 11900,
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "rings",
    material: "18k Solid Yellow Gold (Hallmarked)",
    weight: "3.4 g",
    dimensions: "Stone: 8 mm × 6 mm (1.75 ct equivalent)",
    inStock: true,
    featured: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 22,
    collectionSlug: "timeless-gold",
    variants: [
      { id: "v7-1", name: "Size 5", inStock: true },
      { id: "v7-2", name: "Size 6", inStock: true },
      { id: "v7-3", name: "Size 7", inStock: true },
      { id: "v7-4", name: "Size 8", inStock: true },
    ],
    details: [
      "Precision cut for deep crystal clarity",
      "Knife-edge silhouette for a delicate visual footprint",
      "Custom laser hallmark inside shank",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p8",
    slug: "maya-baroque-pearl-drops",
    name: "Maya Baroque Pearl Drops",
    subtitle: "Uniquely shaped twin baroque pearls suspended from gold huggies",
    description:
      "Naturally asymmetrical sea baroque pearls suspended from solid 14k gold huggie hoops. No two pearls are ever identical, honoring natural imperfection.",
    story:
      "Wabi-sabi philosophy applied to fine adornment. Celebrates the organic irregularities that prove genuine aquatic origin.",
    price: 8400,
    discountedPrice: 7600,
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "earrings",
    material: "14k Solid Gold Huggies & Natural Baroque Pearls",
    weight: "7.1 g pair",
    dimensions: "Drop: 32 mm, Pearl: approx 15 mm",
    inStock: true,
    featured: true,
    isNew: true,
    rating: 4.8,
    reviewCount: 35,
    collectionSlug: "the-pearl-edit",
    variants: [
      { id: "v8-1", name: "Yellow Gold Huggie", inStock: true },
      { id: "v8-2", name: "White Gold Huggie", inStock: true },
    ],
    details: [
      "Removable pearl drops — huggie can be worn solo",
      "High-luster nacre with gentle rainbow overtones",
      "Secure snap-bar clasp",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p9",
    slug: "dev-twisted-cuff",
    name: "Dev Sculptural Twisted Cuff",
    subtitle: "Continuous torqued torque bracelet in satin 18k vermeil",
    description:
      "A bold, fluid cuff forged from a single tapered ribbon of metal twisted at the crest. Open back design offers gentle custom sizing to your wrist.",
    story:
      "Inspired by the modern bronze sculptures of Brâncuși — simple forms that hold profound kinetic energy.",
    price: 11200,
    discountedPrice: 9800,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "bracelets",
    material: "18k Gold Vermeil on Sterling Silver Base",
    weight: "22.4 g",
    dimensions: "60 mm inner diameter, flexible opening",
    inStock: true,
    featured: false,
    isNew: true,
    rating: 4.9,
    reviewCount: 14,
    collectionSlug: "timeless-gold",
    variants: [
      { id: "v9-1", name: "Standard (Fits wrists 14-17 cm)", inStock: true },
      { id: "v9-2", name: "Large (Fits wrists 17-20 cm)", inStock: true },
    ],
    details: [
      "Hand-polished mirror edges with satin crest",
      "Ergonomic curvature prevents twisting on wrist",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p10",
    slug: "anika-snake-chain-choker",
    name: "Anika Liquid Snake Chain",
    subtitle: "Silky flat herringbone chain that curves like liquid metal",
    description:
      "A 4.5mm flat herringbone chain engineered to rest completely flat along the collarbone. Reflects sweeping unbroken ribbons of warm gold light.",
    story:
      "A 90s editorial staple made timeless with improved link flexibility that resists kinking and drapes like heavy silk.",
    price: 9200,
    discountedPrice: 7900,
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "necklaces",
    material: "18k Gold Vermeil",
    weight: "14.2 g",
    dimensions: "38 cm + 6 cm extender",
    inStock: true,
    featured: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 28,
    collectionSlug: "timeless-gold",
    variants: [
      { id: "v10-1", name: "4.5 mm Width", inStock: true },
      { id: "v10-2", name: "6.0 mm Bold Width", inStock: true },
    ],
    details: [
      "Reinforced end caps prevent chain twist",
      "Ultra-smooth skin touch — zero pinching",
      "Ideal foundation anchor for layered necklaces",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p11",
    slug: "roshni-diamond-pave-band",
    name: "Roshni Pavé Eternity Band",
    subtitle: "Continuous micro-pavé lab diamonds set in 14k white gold",
    description:
      "Thirty-four conflict-free micro-pavé stones precisely microscope-set along an ultra-slim 1.6mm band with delicate milgrain edging.",
    story:
      "Roshni translates to radiant light. A whisper-thin ring that stacks seamlessly beside any heirloom engagement ring.",
    price: 16500,
    discountedPrice: 14200,
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "rings",
    material: "14k Solid White Gold & VS1 Lab Diamonds",
    weight: "2.1 g",
    dimensions: "Band width: 1.6 mm",
    inStock: true,
    featured: false,
    isNew: true,
    rating: 5.0,
    reviewCount: 26,
    collectionSlug: "silver-moon",
    variants: [
      { id: "v11-1", name: "Size 5", inStock: true },
      { id: "v11-2", name: "Size 6", inStock: true },
      { id: "v11-3", name: "Size 7", inStock: true },
      { id: "v11-4", name: "Size 8", inStock: true },
    ],
    details: [
      "F-G color, VS1 clarity diamonds (0.35 ctw)",
      "Low-profile setting prevents snagging on knits",
      "IGI Certificate card included",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p12",
    slug: "shanti-medallion-pendant",
    name: "Shanti Sunburst Coin Pendant",
    subtitle: "Embossed ancient sunburst medallion on vintage rope chain",
    description:
      "A rustic hand-hammered coin medallion inspired by ancient Chola coinage, suspended from a sturdy 2.2mm diamond-cut French rope chain.",
    story:
      "A reminder of quiet inner constancy. Forged with irregular edges to resemble a discovered artifact.",
    price: 8900,
    discountedPrice: 7500,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "pendants",
    material: "18k Heavy Gold Vermeil over 925 Silver",
    weight: "11.6 g",
    dimensions: "Medallion: 20 mm, Chain: 50 cm",
    inStock: true,
    featured: false,
    isNew: false,
    rating: 4.8,
    reviewCount: 18,
    collectionSlug: "timeless-gold",
    variants: [
      { id: "v12-1", name: "50 cm Chain", inStock: true },
      { id: "v12-2", name: "60 cm Long Chain", inStock: true },
    ],
    details: [
      "Reversible medallion: Sunburst on front, plain satin on reverse",
      "Heavy French rope chain with high tensile strength",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p13",
    slug: "padma-lotus-ear-studs",
    name: "Padma Minimalist Lotus Studs",
    subtitle: "Geometric layered petals in warm brushed yellow gold",
    description:
      "Pared-back geometric lotus blooms rendered in three overlapping planes of brushed 18k gold vermeil. Discrete yet arresting upon close view.",
    story:
      "The lotus rises through murky water completely untarnished. A delicate symbol of resilience and daily renewal.",
    price: 4900,
    discountedPrice: 4200,
    images: [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "earrings",
    material: "18k Gold Vermeil with Surgical Titanium Posts",
    weight: "2.8 g pair",
    dimensions: "9 mm × 9 mm",
    inStock: true,
    featured: false,
    isNew: true,
    rating: 4.9,
    reviewCount: 21,
    collectionSlug: "timeless-gold",
    variants: [
      { id: "v13-1", name: "Brushed Yellow Gold", inStock: true },
      { id: "v13-2", name: "Polished Rose Gold", inStock: true },
    ],
    details: [
      "Grade-1 titanium posts for sensitive earlobes",
      "Secure custom butterfly friction backs",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p14",
    slug: "zoya-tennis-bracelet",
    name: "Zoya Bezel Tennis Bracelet",
    subtitle: "Low-profile bezel-set round cut stones with double safety clasp",
    description:
      "A modern reimagining of the classic prong tennis bracelet. Smooth individual circular bezels encase each stone so the bracelet glides over cashmere without snagging.",
    story:
      "Designed for the woman who wears diamond light to morning coffee, museum strolls, and late dinners alike.",
    price: 18900,
    discountedPrice: 16500,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "bracelets",
    material: "18k White Gold Vermeil & Created White Sapphires",
    weight: "12.8 g",
    dimensions: "17 cm length, 3.2 mm stone width",
    inStock: true,
    featured: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 39,
    collectionSlug: "silver-moon",
    variants: [
      { id: "v14-1", name: "16 cm (Petite)", inStock: true },
      { id: "v14-2", name: "17.5 cm (Standard)", inStock: true },
      { id: "v14-3", name: "19 cm (Relaxed)", inStock: true },
    ],
    details: [
      "Bezel cup engineering protects gemstone edges",
      "Box clasp with dual fold-over safety latches",
      "Flexible link articulation for fluid drape",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p15",
    slug: "surya-statement-ring",
    name: "Surya Dome Statement Ring",
    subtitle: "Heavy hollowed bombé dome ring in mirror-polished gold",
    description:
      "A sweeping, voluptuous bombé dome ring that commands attention through pure form rather than stones. Mirror-polished along the crown.",
    story:
      "Named for Surya, the sun god. Reflects the entire room in its high-convex mirror curve.",
    price: 8800,
    discountedPrice: 7900,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "rings",
    material: "18k Heavy Gold Vermeil over 925 Sterling Silver",
    weight: "9.8 g",
    dimensions: "12 mm height at crest",
    inStock: true,
    featured: false,
    isNew: true,
    rating: 4.7,
    reviewCount: 15,
    collectionSlug: "timeless-gold",
    variants: [
      { id: "v15-1", name: "US 6 / IN 12", inStock: true },
      { id: "v15-2", name: "US 7 / IN 14", inStock: true },
      { id: "v15-3", name: "US 8 / IN 16", inStock: true },
    ],
    details: [
      "Hollow dome with smooth inner undergallery",
      "Weighted balance prevents spin on the finger",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p16",
    slug: "kavita-choker-set",
    name: "Kavita Polki & Emerald Bridal Set",
    subtitle: "Complete ceremonial necklace, ear danglers & maang tikka",
    description:
      "A magnificent polki-cut set bordered by emerald tumble beads and seed pearls. Hand-crafted using century-old closed setting techniques.",
    story:
      "An ode to classical Deccan royalty, softened with pastel green tones for contemporary outdoor weddings.",
    price: 34500,
    discountedPrice: 29800,
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "sets",
    material: "22k Gold Micron Plating, Uncut Glass Polki, Emerald Beads",
    weight: "84 g total set",
    dimensions: "Collar width: 4.8 cm, Earrings drop: 6.5 cm",
    inStock: true,
    featured: true,
    isNew: true,
    rating: 5.0,
    reviewCount: 19,
    collectionSlug: "atelier-heritage",
    variants: [
      { id: "v16-1", name: "Complete 3-Piece Set", inStock: true },
      { id: "v16-2", name: "Necklace & Earrings Only", inStock: true },
    ],
    details: [
      "Handcrafted over 48 artisan hours",
      "Includes Certificate of Artisan Craftsmanship",
      "Custom velvet bridal travel trunk included",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p17",
    slug: "vellore-brass-jewelry-dish",
    name: "Vellore Cast Brass Dish",
    subtitle: "Sand-cast solid brass trinket catchall with raw rim",
    description:
      "A heavy solid brass catchall dish for your nightly ring and watch deposit. Sand-cast in Tamil Nadu and left unlacquered to develop a personal patina over decades.",
    story:
      "Jewelry deserves a conscious resting place. Sand-cast in traditional foundry moulds with natural organic imperfections.",
    price: 3800,
    discountedPrice: 3200,
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "others",
    material: "100% Solid Sand-Cast Brass (Unlacquered)",
    weight: "320 g",
    dimensions: "10.5 cm diameter, 2 cm rim height",
    inStock: true,
    featured: false,
    isNew: false,
    rating: 4.9,
    reviewCount: 17,
    collectionSlug: "timeless-gold",
    variants: [
      { id: "v17-1", name: "Satin Warm Brass", inStock: true },
      { id: "v17-2", name: "Verdigris Patina", inStock: true },
    ],
    details: [
      "Padded cork base protects dresser surfaces",
      "Ages gracefully and can be polished back to bright gold anytime",
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p18",
    slug: "amrita-baroque-lariat",
    name: "Amrita Adjustable Pearl Lariat",
    subtitle: "Sliding gold bead allows endless neckline configurations",
    description:
      "A flowing 70cm fine gold chain terminating in twin natural baroque pearls. A silicone-lined sliding sphere lets you adjust the drop from high choker to deep plunge.",
    story:
      "Designed for unstudied elegance. Transitions smoothly from tailored silk shirts to evening backless gowns.",
    price: 13900,
    discountedPrice: 11800,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "necklaces",
    material: "18k Gold Vermeil & Handpicked Baroque Pearls",
    weight: "11.2 g",
    dimensions: "70 cm total chain length",
    inStock: true,
    featured: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 27,
    collectionSlug: "the-pearl-edit",
    variants: [
      { id: "v18-1", name: "Yellow Gold Vermeil", inStock: true },
      { id: "v18-2", name: "Rose Gold Vermeil", inStock: true },
    ],
    details: [
      "Silicone friction slide stays in place securely",
      "Can be worn forward as lariat or reversed down an open back",
    ],
    createdAt: now,
    updatedAt: now,
  },
];

export const reviews: Record<string, Review[]> = {
  p1: [
    {
      id: "r1-1",
      author: "Pooja Hegde",
      rating: 5,
      date: "2026-08-14",
      title: "Even more breathtaking in person",
      comment:
        "The luster on these pearls has an almost moonlight glow. The gold clasp feels very solid and doesn't pinch my hair. Came in the most beautiful suede box.",
      verifiedPurchase: true,
      location: "Mumbai",
    },
    {
      id: "r1-2",
      author: "Aditi Rao",
      rating: 5,
      date: "2026-08-28",
      title: "Subtle, quiet luxury",
      comment:
        "I've worn this three days a week with both silk shirts and handloom kurtas. It feels modern, not old-fashioned at all.",
      verifiedPurchase: true,
      location: "Bengaluru",
    },
  ],
  p2: [
    {
      id: "r2-1",
      author: "Shreya Nair",
      rating: 5,
      date: "2026-07-22",
      title: "Genuinely weightless",
      comment:
        "Usually chunky hoops hurt my earlobes after an hour. These are so lightweight I fell asleep wearing them! The brushed finish is perfection.",
      verifiedPurchase: true,
      location: "Kochi",
    },
  ],
  p3: [
    {
      id: "r3-1",
      author: "Vikram Sen",
      rating: 5,
      date: "2026-08-05",
      title: "Substantial heirloom feel",
      comment:
        "Solid sterling silver with great weight. It feels like something passed down from a grandfather yet fits my everyday wardrobe seamlessly.",
      verifiedPurchase: true,
      location: "New Delhi",
    },
  ],
  p7: [
    {
      id: "r7-1",
      author: "Tarini Shah",
      rating: 5,
      date: "2026-09-02",
      title: "The green is hypnotic",
      comment:
        "The deep forest green tone in natural daylight is unbelievable. Stacks flush with my thin gold band just as promised.",
      verifiedPurchase: true,
      location: "Hyderabad",
    },
  ],
};

export function getProductBySlug(slug: string): Product | undefined {
  return catalog.find((product) => product.slug === slug);
}

export function getProductsByCategory(category?: string): Product[] {
  if (!category || category === "all") return catalog;
  return catalog.filter((product) => product.category === category);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  return catalog.filter((product) => product.collectionSlug === collectionSlug);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getReviewsForProduct(productId: string): Review[] {
  return reviews[productId] || [
    {
      id: `default-${productId}`,
      author: "Ananya M.",
      rating: 5,
      date: "2026-08-15",
      title: "Flawless craftsmanship",
      comment:
        "Stunning piece. The weight, the tactile polish, and the packaging exceeded all expectations.",
      verifiedPurchase: true,
      location: "Bengaluru",
    },
  ];
}

export function displayPrice(product: Product): number {
  return product.discountedPrice ?? product.price;
}
