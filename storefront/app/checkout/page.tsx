"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { cartTotal, formatCurrency } from "@thumba/shared";
import { useCartStore } from "@/lib/cart-store";

type RazorpaySuccess = { razorpay_payment_id: string; razorpay_order_id: string };

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const total = cartTotal(items);
  const [status, setStatus] = useState<"idle" | "paying" | "paid" | "error">("idle");
  const [message, setMessage] = useState("");

  if (items.length === 0 && status !== "paid") {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-serif text-4xl">Nothing to check out</h1>
        <Link href="/shop" className="mt-6 inline-block text-gold-700 underline">
          Return to shop
        </Link>
      </main>
    );
  }

  if (status === "paid") {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-serif text-4xl text-ink-900">Payment received</h1>
        <p className="mt-4 text-ink-700">{message}</p>
        <Link href="/shop" className="mt-8 inline-block rounded-full bg-ink-900 px-8 py-3 text-ivory-50">
          Keep browsing
        </Link>
      </main>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("paying");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const shipping = {
      street: String(form.get("street") || ""),
      city: String(form.get("city") || ""),
      state: String(form.get("state") || ""),
      country: String(form.get("country") || "India"),
      zipCode: String(form.get("zipCode") || ""),
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shipping }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not start checkout");
      }

      await loadRazorpayScript();
      if (!window.Razorpay) throw new Error("Razorpay checkout is unavailable");

      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Thumba",
        description: "Jewelry order",
        order_id: data.orderId,
        handler: (payment: RazorpaySuccess) => {
          clear();
          setStatus("paid");
          setMessage(`Test payment ${payment.razorpay_payment_id} captured. Order ${payment.razorpay_order_id}.`);
        },
        modal: {
          ondismiss: () => {
            setStatus("idle");
            setMessage("Checkout closed before payment.");
          },
        },
        prefill: {
          name: String(form.get("name") || ""),
          email: String(form.get("email") || ""),
        },
      });
      checkout.open();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Checkout failed");
    }
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="font-serif text-4xl text-ink-900">Checkout</h1>
        <p className="text-sm text-ink-700">
          Uses Razorpay test mode only. Add <code className="rounded bg-ivory-100 px-1">rzp_test_</code> keys to the
          root <code className="rounded bg-ivory-100 px-1">.env</code> file.
        </p>
        <Field name="name" label="Full name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="street" label="Street" required />
        <Field name="city" label="City" required />
        <Field name="state" label="State" required />
        <Field name="zipCode" label="PIN code" required />
        <Field name="country" label="Country" defaultValue="India" required />
        {message && status !== "paying" ? <p className="text-sm text-brand-700">{message}</p> : null}
        <button
          type="submit"
          disabled={status === "paying"}
          className="mt-4 w-full rounded-full bg-ink-900 py-3 text-ivory-50 disabled:opacity-60"
        >
          {status === "paying" ? "Opening Razorpay…" : `Pay ${formatCurrency(total)}`}
        </button>
      </form>
      <aside className="rounded-2xl border border-ivory-200 bg-ivory-50 p-6">
        <h2 className="font-serif text-2xl">Order</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex justify-between border-t border-ivory-200 pt-4 font-medium">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </p>
      </aside>
    </main>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-ink-700">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-ivory-200 bg-white px-3 py-2"
      />
    </label>
  );
}
