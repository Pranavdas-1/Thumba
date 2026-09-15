'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
} from 'lucide-react';
import { BRAND, CATEGORY_LABELS } from '@thumba/shared';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="border-t border-ivory-200 bg-ivory-100 text-ink-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_0.75fr_0.75fr_1fr] lg:gap-10">
          <div>
            <Link
              href="/"
              className="font-serif text-4xl tracking-[0.08em] text-ink-900"
            >
              {BRAND.name}
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-ink-600">
              {BRAND.description}
            </p>
            <div className="mt-10 max-w-md border-t border-ivory-300 pt-5">
              <p className="font-serif text-xl text-ink-900">
                The Atelier Journal
              </p>
              <p className="mt-1 text-xs leading-5 text-ink-600">
                Private release previews, material stories, and occasional notes
                from the workbench.
              </p>
              {subscribed ? (
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-ink-900">
                  <Check className="h-4 w-4 text-gold-700" /> You are on the
                  list.
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="mt-4 flex max-w-sm border-b border-ink-900"
                >
                  <label htmlFor="journal-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="journal-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Your email address"
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to the Atelier Journal"
                    className="btn-press px-2 text-ink-900 hover:text-gold-700"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div>
            <p className="eyebrow text-gold-700">Explore</p>
            <ul className="mt-5 space-y-3 text-sm text-ink-700">
              <li>
                <Link href="/shop" className="hover:text-gold-700">
                  All jewelry
                </Link>
              </li>
              {Object.entries(CATEGORY_LABELS)
                .slice(0, 5)
                .map(([key, label]) => (
                  <li key={key}>
                    <Link
                      href={`/shop?category=${key}`}
                      className="hover:text-gold-700"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/collections" className="hover:text-gold-700">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gold-700">Concierge</p>
            <ul className="mt-5 space-y-4 text-sm text-ink-700">
              <li>
                <span className="block text-xs text-ink-500">
                  Questions about a piece
                </span>
                <span className="text-ink-900">{BRAND.supportEmail}</span>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-gold-700">
                  Jewelry care guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gold-700">The point of view</p>
            <p className="mt-5 text-sm leading-7 text-ink-600">
              Quiet forms, considered proportions, and pieces chosen for the
              way they become part of your everyday.
            </p>
            <p className="mt-8 border-l border-gold-600 pl-4 font-serif text-lg italic text-ink-900">
              Jewelry with a quiet point of view.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-ivory-300 pt-6 text-[10px] uppercase tracking-[0.14em] text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Thumba Atelier Private Limited</p>
          <p>Made for considered collecting.</p>
        </div>
      </div>
    </footer>
  );
}
