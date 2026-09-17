export const BRAND = {
  name: "Thumba",
  tagline: "Fine Jewelry, Quiet Luxury",
  description:
    "Fine jewelry in gold, silver, pearls, and stones. Sculptural pieces with a quiet point of view.",
  currency: "INR",
  currencySymbol: "₹",
  supportEmail: "Thumbacollections@gmail.com",
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
  SHIPPING_FEE: 70,
  EXPRESS_SHIPPING_FEE: 450,
  TAX_RATE: 0.03, // 3% GST on fine jewelry in India
} as const;

export const STOREFRONT_ROUTES = {
  HOME: "/",
  SHOP: "/shop",
  COLLECTIONS: "/collections",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ABOUT: "/#about",
  CONTACT: "/#contact",
} as const;

export const DASHBOARD_ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  ORDERS: "/orders",
  CUSTOMERS: "/customers",
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

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  packed: "Packed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};
