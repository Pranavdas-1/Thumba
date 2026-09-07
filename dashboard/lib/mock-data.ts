import type { Order, User } from "@thumba/shared";

export const mockCustomers: User[] = [
  {
    id: "u1",
    name: "Ananya Rao",
    email: "ananya@example.com",
    role: "customer",
    createdAt: "2026-08-12T00:00:00.000Z",
    updatedAt: "2026-08-12T00:00:00.000Z",
  },
  {
    id: "u2",
    name: "Meera Iyer",
    email: "meera@example.com",
    role: "customer",
    createdAt: "2026-08-20T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z",
  },
];

export const mockOrders: Order[] = [
  {
    id: "ORD-1001",
    userId: "u1",
    items: [{ productId: "p2", productName: "Aruna Hoop Earrings", quantity: 1, price: 5400 }],
    total: 5400,
    status: "processing",
    shippingAddress: {
      street: "12 Lake View",
      city: "Bengaluru",
      state: "KA",
      country: "India",
      zipCode: "560001",
    },
    createdAt: "2026-09-02T00:00:00.000Z",
    updatedAt: "2026-09-03T00:00:00.000Z",
  },
  {
    id: "ORD-1002",
    userId: "u2",
    items: [{ productId: "p1", productName: "Nila Pearl Necklace", quantity: 1, price: 11200 }],
    total: 11200,
    status: "shipped",
    shippingAddress: {
      street: "88 Marine Drive",
      city: "Mumbai",
      state: "MH",
      country: "India",
      zipCode: "400002",
    },
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-04T00:00:00.000Z",
  },
];
