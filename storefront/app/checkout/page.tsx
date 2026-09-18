'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  cartTotal,
  formatCurrency,
  calculateTax,
  BRAND,
  DEFAULT_PRICES,
} from '@thumba/shared';
import { useCartStore } from '@/lib/cart-store';
import { TrustBadges } from '@/components/TrustBadges';

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type CheckoutField = 'name' | 'email' | 'street' | 'city' | 'state' | 'zipCode';
type FieldErrors = Partial<Record<CheckoutField, string>>;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p id={id} className="mt-1 text-xs text-red-700">{message}</p>;
}

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
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Could not load secure Razorpay checkout'));
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);

  const [status, setStatus] = useState<'idle' | 'paying' | 'paid' | 'error'>(
    'idle',
  );
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [paymentDetails, setPaymentDetails] = useState<RazorpaySuccess | null>(
    null,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-24 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gold-600 border-t-transparent" />
      </main>
    );
  }

  const subtotal = cartTotal(items);
  const tax = calculateTax(subtotal, DEFAULT_PRICES.TAX_RATE);
  const shippingFee = DEFAULT_PRICES.SHIPPING_FEE;
  const grandTotal = subtotal + tax + shippingFee;

  if (items.length === 0 && status !== 'paid') {
    return (
      <main className="mx-auto max-w-xl px-4 py-28 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-ink-900 sm:text-4xl">
          Nothing to check out
        </h1>
        <p className="mt-3 text-sm text-ink-600">
          Your shopping bag is currently empty.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-900 px-8 py-3.5 text-sm font-medium text-ivory-50 transition hover:bg-ink-800"
        >
          <span>Return to shop</span>
        </Link>
      </main>
    );
  }

  if (status === 'paid') {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-gold-800">
          <CheckCircle2 className="h-10 w-10 text-gold-700" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-editorial text-gold-700">
          Payment Confirmed
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-ink-900 sm:text-5xl">
          Thank you for your order
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-600">
          Your jewels are now being prepared for dispatch. A
          confirmation email and tracking docket will be dispatched shortly.
        </p>

        {paymentDetails && (
          <div className="mt-8 rounded-2xl border border-ivory-200 bg-white p-6 text-left text-xs shadow-sm">
            <p className="font-serif text-base font-medium text-ink-900">
              Transaction Details
            </p>
            <dl className="mt-3 space-y-2 text-ink-700">
              <div className="flex justify-between">
                <dt className="text-ink-500">Payment Reference:</dt>
                <dd className="font-mono">
                  {paymentDetails.razorpay_payment_id}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Order Docket:</dt>
                <dd className="font-mono">
                  {paymentDetails.razorpay_order_id}
                </dd>
              </div>
            </dl>
          </div>
        )}

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-ink-900 px-8 py-3.5 text-sm font-medium text-ivory-50 transition hover:bg-ink-800 active:scale-97"
          >
            Continue browsing pieces
          </Link>
        </div>
      </main>
    );
  }

  function clearFieldError(field: CheckoutField) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    const form = new FormData(event.currentTarget);
    const values = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      street: String(form.get('street') || '').trim(),
      city: String(form.get('city') || '').trim(),
      state: String(form.get('state') || '').trim(),
      zipCode: String(form.get('zipCode') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
    };
    const errors: FieldErrors = {};
    if (!values.name) errors.name = 'This field is required';
    if (!values.email) errors.email = 'This field is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Please enter a valid email address';
    if (!values.street) errors.street = 'This field is required';
    if (!values.city) errors.city = 'This field is required';
    if (!values.state) errors.state = 'This field is required';
    if (!values.zipCode) errors.zipCode = 'This field is required';
    else if (!/^\d{6}$/.test(values.zipCode)) errors.zipCode = 'Please enter a valid PIN code';

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus('idle');
      return;
    }

    setStatus('paying');
    const shipping = {
      street: values.street,
      city: values.city,
      state: values.state,
      zipCode: values.zipCode,
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shipping }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not start checkout');
      }

      await loadRazorpayScript();
      if (!window.Razorpay) {
        throw new Error('Razorpay checkout is unavailable');
      }

      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: BRAND.name,
        description: 'Fine Jewelry Order',
        order_id: data.orderId,
        handler: async (payment: RazorpaySuccess) => {
          try {
            const confirmation = await fetch('/api/checkout/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: payment.razorpay_order_id,
                paymentId: payment.razorpay_payment_id,
                razorpaySignature: payment.razorpay_signature,
                customer: {
                  name: values.name,
                  email: values.email,
                  phone: values.phone,
                },
                items: items.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                })),
                shipping,
              }),
            });
            const result = await confirmation.json();
            if (!confirmation.ok) throw new Error(result.error || 'Could not save the order');
            clear();
            setPaymentDetails(payment);
            setStatus('paid');
            setMessage('Test payment captured.');
          } catch (error) {
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Could not save the order');
          }
        },
        modal: {
          ondismiss: () => {
            setStatus('idle');
            setMessage('Checkout window closed.');
          },
        },
        prefill: {
          name: values.name,
          email: values.email,
          contact: values.phone,
        },
        theme: {
          color: '#171412',
        },
      });

      checkout.open();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Checkout failed');
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-900 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Return to bag</span>
        </Link>
        <p className="eyebrow mt-5 text-gold-700">The final detail</p>
        <h1 className="mt-3 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-ink-900 sm:text-6xl">
          Secure Checkout
        </h1>
        <p className="mt-1 text-xs text-ink-500">
          Complete your delivery details to place the order.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column (7 cols): Checkout Form */}
        <div className="lg:col-span-7">
          <form onSubmit={onSubmit} noValidate className="space-y-8">
            {/* Contact Information */}
            <div className="border-y border-ivory-200 bg-white p-6 sm:p-8">
              <h2 className="font-serif text-xl font-semibold text-ink-900">
                1. Contact Information
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-ink-700">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                    onChange={() => clearFieldError('name')}
                    className={`mt-1 w-full border-b bg-transparent px-0 py-3 text-xs text-ink-900 focus:border-gold-600 focus:outline-none ${fieldErrors.name ? 'border-red-500' : 'border-ivory-300'}`}
                  />
                  <FieldError id="name-error" message={fieldErrors.name} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-700">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="priya@example.com"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                    onChange={() => clearFieldError('email')}
                    className={`mt-1 w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs text-ink-900 shadow-sm focus:border-gold-600 focus:outline-none ${fieldErrors.email ? 'border-red-500' : 'border-ivory-300'}`}
                  />
                  <FieldError id="email-error" message={fieldErrors.email} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-ink-700">
                    Phone (for delivery updates)
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="mt-1 w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2.5 text-xs text-ink-900 shadow-sm focus:border-gold-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="border-y border-ivory-200 bg-white p-6 sm:p-8">
              <h2 className="font-serif text-xl font-semibold text-ink-900">
                2. Delivery Address
              </h2>
              <p className="mt-2 text-xs leading-5 text-ink-500">
                Delivery is available within India only. No international shipping.
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ink-700">
                    Street Address & House / Flat No.
                  </label>
                  <input
                    name="street"
                    type="text"
                    placeholder="42, 5th Cross, Lavelle Road"
                    aria-invalid={Boolean(fieldErrors.street)}
                    aria-describedby={fieldErrors.street ? 'street-error' : undefined}
                    onChange={() => clearFieldError('street')}
                    className={`mt-1 w-full border-b bg-transparent px-0 py-3 text-xs text-ink-900 focus:border-gold-600 focus:outline-none ${fieldErrors.street ? 'border-red-500' : 'border-ivory-300'}`}
                  />
                  <FieldError id="street-error" message={fieldErrors.street} />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-ink-700">
                      City
                    </label>
                    <input
                      name="city"
                      type="text"
                       placeholder="Bengaluru"
                       aria-invalid={Boolean(fieldErrors.city)}
                       aria-describedby={fieldErrors.city ? 'city-error' : undefined}
                       onChange={() => clearFieldError('city')}
                       className={`mt-1 w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs text-ink-900 shadow-sm focus:border-gold-600 focus:outline-none ${fieldErrors.city ? 'border-red-500' : 'border-ivory-300'}`}
                     />
                     <FieldError id="city-error" message={fieldErrors.city} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-700">
                      State
                    </label>
                    <input
                      name="state"
                      type="text"
                       placeholder="Karnataka"
                       aria-invalid={Boolean(fieldErrors.state)}
                       aria-describedby={fieldErrors.state ? 'state-error' : undefined}
                       onChange={() => clearFieldError('state')}
                       className={`mt-1 w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs text-ink-900 shadow-sm focus:border-gold-600 focus:outline-none ${fieldErrors.state ? 'border-red-500' : 'border-ivory-300'}`}
                     />
                     <FieldError id="state-error" message={fieldErrors.state} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-ink-700">
                      PIN Code
                    </label>
                    <input
                      name="zipCode"
                      type="text"
                       placeholder="560001"
                       aria-invalid={Boolean(fieldErrors.zipCode)}
                       aria-describedby={fieldErrors.zipCode ? 'zipCode-error' : undefined}
                       onChange={() => clearFieldError('zipCode')}
                       className={`mt-1 w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs text-ink-900 shadow-sm focus:border-gold-600 focus:outline-none ${fieldErrors.zipCode ? 'border-red-500' : 'border-ivory-300'}`}
                     />
                     <FieldError id="zipCode-error" message={fieldErrors.zipCode} />
                  </div>
                </div>

              </div>
            </div>

            {/* Error Message if any */}
            {message && status === 'error' && (
              <div className="border-y border-brand-200 bg-brand-50 p-4 text-xs text-brand-800">
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'paying'}
              className="btn-press flex w-full items-center justify-center gap-2 bg-ink-900 py-4 text-sm font-medium text-ivory-50 transition-colors hover:bg-ink-800 disabled:opacity-60"
            >
              <Lock className="h-4 w-4" />
              <span>
                {status === 'paying'
                  ? 'Opening Secure Razorpay Portal…'
                  : `Pay ${formatCurrency(grandTotal)}`}
              </span>
            </button>
          </form>
        </div>

        {/* Right Column (5 cols): Order Summary */}
        <div className="lg:col-span-5">
          <aside className="sticky top-24 border border-ivory-200 bg-white p-6 sm:p-8">
            <h2 className="font-serif text-xl font-semibold text-ink-900">
              Order Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>

            <ul className="mt-4 max-h-80 divide-y divide-ivory-200 overflow-y-auto pr-1">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-3.5 py-3.5"
                >
                  <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-ivory-100">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 justify-between">
                    <div>
                      <p className="font-serif text-sm font-medium text-ink-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-ink-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-serif text-sm font-medium text-ink-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-ivory-200 pt-6 text-xs">
              <div className="flex justify-between text-ink-600">
                <dt>Subtotal</dt>
                <dd className="font-medium text-ink-900">
                  {formatCurrency(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between text-ink-600">
                <dt>GST (3% fine jewelry)</dt>
                <dd className="font-medium text-ink-900">
                  {formatCurrency(tax)}
                </dd>
              </div>
              <div className="flex justify-between text-ink-600">
                <dt>Delivery</dt>
                <dd className="font-medium text-gold-700">{formatCurrency(shippingFee)}</dd>
              </div>
            </dl>

            <div className="mt-6 flex justify-between border-t border-ivory-200 pt-4">
              <span className="font-serif text-base font-semibold text-ink-900">
                Total Payable
              </span>
              <span className="font-serif text-xl font-bold text-ink-900">
                {formatCurrency(grandTotal)}
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-ivory-50 p-3.5 text-center text-xs text-ink-600">
              <div className="flex items-center justify-center gap-1.5 font-medium text-ink-900">
                <Lock className="h-4 w-4 text-gold-700" />
                <span>Test Mode Checkout</span>
              </div>
              <p className="mt-1 text-[11px] text-ink-500">
                Uses Razorpay test keys from the workspace environment.
              </p>
            </div>
            <p className="mt-4 text-center text-[11px] leading-5 text-ink-500">
              Delivery is available within India only. No international shipping.
            </p>
            <TrustBadges className="mt-5" />
          </aside>
        </div>
      </div>
    </main>
  );
}
