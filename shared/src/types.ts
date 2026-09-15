export type Category =
  | "necklaces"
  | "earrings"
  | "rings"
  | "bracelets"
  | "pendants"
  | "sets"
  | "others";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type UserRole = "customer" | "admin";

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  inStock: boolean;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase?: boolean;
  location?: string;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  heroImage?: string;
  featured?: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  story?: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: Category;
  material: string;
  weight: string;
  dimensions?: string;
  careInstructions?: string;
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  collectionSlug?: string;
  variants?: ProductVariant[];
  details?: string[];
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  variantName?: string;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantName?: string;
};

export type WishlistItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: Category;
  inStock: boolean;
  addedAt: string;
};
