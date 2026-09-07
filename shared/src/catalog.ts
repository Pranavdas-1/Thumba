import type { Product } from "./types";

const now = "2026-09-01T00:00:00.000Z";

export const catalog: Product[] = [
  {
    id: "p1",
    slug: "nila-pearl-necklace",
    name: "Nila Pearl Necklace",
    description:
      "A quiet strand of freshwater pearls on a gold-filled clasp. Made for evenings that start at dusk and linger.",
    price: 12800,
    discountedPrice: 11200,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "necklaces",
    material: "Gold-filled, freshwater pearls",
    weight: "18 g",
    inStock: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p2",
    slug: "aruna-hoop-earrings",
    name: "Aruna Hoop Earrings",
    description:
      "Sculpted hoops with a brushed gold finish. Light enough for all day, substantial enough to notice.",
    price: 5400,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "earrings",
    material: "18k gold vermeil",
    weight: "6 g",
    inStock: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p3",
    slug: "kiran-signet-ring",
    name: "Kiran Signet Ring",
    description:
      "An oval signet with a satin face. Engrave it later, or leave it blank — it already feels like an heirloom.",
    price: 8900,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "rings",
    material: "Sterling silver, gold plate",
    weight: "7 g",
    inStock: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p4",
    slug: "meera-chain-bracelet",
    name: "Meera Chain Bracelet",
    description:
      "A fine figaro chain that sits close to the wrist. Designed to layer, or to wear alone.",
    price: 4200,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "bracelets",
    material: "Gold-filled",
    weight: "8 g",
    inStock: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p5",
    slug: "tara-moon-pendant",
    name: "Tara Moon Pendant",
    description:
      "A crescent pendant on a 45 cm chain. Small, bright, and meant to be worn every day.",
    price: 6100,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "pendants",
    material: "Sterling silver",
    weight: "4 g",
    inStock: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p6",
    slug: "saheli-bridal-set",
    name: "Saheli Bridal Set",
    description:
      "Necklace, earrings, and a matching bracelet in antique gold tone. A complete look without the weight of tradition.",
    price: 24600,
    discountedPrice: 21900,
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "sets",
    material: "Gold-plated brass, kundan glass",
    weight: "62 g",
    inStock: true,
    createdAt: now,
    updatedAt: now,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return catalog.find((product) => product.slug === slug);
}

export function getProductsByCategory(category?: string): Product[] {
  if (!category || category === "all") return catalog;
  return catalog.filter((product) => product.category === category);
}

export function displayPrice(product: Product): number {
  return product.discountedPrice ?? product.price;
}
