export const BRAND = {
  name: "Thumba",
  tagline: "Fine Jewelry, Quiet Luxury",
  description:
    "Fine jewelry in gold, silver, pearls, and stones. Sculptural pieces with a quiet point of view.",
  currency: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 5000,
  supportEmail: "concierge@thumba.in",
  phone: "+91 (0) 80 4912 8800",
  address: "Studio Thumba, Indiranagar, Bengaluru 560038",
} as const;

export const RAZORPAY_CURRENCY = "INR";

export const RAZORPAY_ORDER_STATUS = {
  CREATED: "created",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const DEFAULT_PRICES = {
  SHIPPING_FEE: 0,
  EXPRESS_SHIPPING_FEE: 450,
  TAX_RATE: 0.03, // 3% GST on fine jewelry in India
} as const;

export const STOREFRONT_ROUTES = {
  HOME: "/",
  SHOP: "/shop",
  COLLECTIONS: "/collections",
  WISHLIST: "/wishlist",
  CART: "/cart",
  CHECKOUT: "/checkout",
  SEARCH: "/search",
  ABOUT: "/#about",
  CONTACT: "/#contact",
} as const;

export const DASHBOARD_ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  ORDERS: "/orders",
  CUSTOMERS: "/customers",
  ANALYTICS: "/analytics",
} as const;

export const CATEGORY_LABELS: Record<string, string> = {
  necklaces: "Necklaces",
  earrings: "Earrings",
  rings: "Rings",
  bracelets: "Bracelets",
  pendants: "Pendants",
  sets: "Sets",
  others: "Objet & Gifts",
};

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
] as const;

export type SortOptionValue = (typeof SORT_OPTIONS)[number]["value"];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};
