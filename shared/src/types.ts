export type Category =
  | "necklaces"
  | "earrings"
  | "rings"
  | "bracelets"
  | "pendants"
  | "sets"
  | "others";

export type OrderStatus =
  | "incomplete"
  | "complete";

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
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
  careInstructions?: string;
  stock?: number;
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
  collectionId?: string;
  collectionSlug?: string;
  details?: string[];
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
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
  phone?: string;
  image?: string;
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
};
