export const RAZORPAY_CURRENCY = "INR";

export const RAZORPAY_ORDER_STATUS = {
  CREATED: "created",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const DEFAULT_PRICES = {
  SHIPPING_FEE: 0,
  TAX_RATE: 0.18,
} as const;

export const STOREFRONT_ROUTES = {
  HOME: "/",
  COLLECTIONS: "/collections",
  SHOP: "/shop",
  CART: "/cart",
  CHECKOUT: "/checkout",
  LOGIN: "/login",
  REGISTER: "/register",
  ORDERS: "/orders",
  ACCOUNT: "/account",
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
  others: "Others",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};
