'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { formatCurrency } from '@thumba/shared';
import type { Product } from '@thumba/shared';
import { AddToCartButton } from './AddToCartButton';
import { displayPrice } from '@/lib/products';

export function ProductDetailInteractive({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>(null);


  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="flex flex-col">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/shop?category=${product.category}`}
          className="text-xs uppercase tracking-editorial text-gold-700 font-medium hover:text-gold-800"
        >
          {product.category}
        </Link>
      </div>

      {/* Product Title */}
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink-900 sm:text-4xl md:text-5xl">
        {product.name}
      </h1>

      {product.subtitle && (
        <p className="mt-2 text-sm text-ink-600 font-light italic">
          {product.subtitle}
        </p>
      )}

      {/* Price section */}
      <div className="mt-5 flex items-baseline gap-3">
        <span className="font-serif text-2xl font-medium text-ink-900 sm:text-3xl">
          {formatCurrency(displayPrice(product))}
        </span>
        {product.stock !== undefined && product.stock > 0 && product.stock <= 10 && (
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-red-700">
            Only {product.stock} left
          </span>
        )}
      </div>
      {/* Description */}
      <div className="mt-6 border-t border-ivory-200 pt-6">
        <p className="text-sm leading-relaxed text-ink-700 sm:text-base sm:leading-relaxed">
          {product.description}
        </p>
        {product.story && (
          <p className="mt-3 text-xs leading-relaxed text-ink-500 italic">
            &ldquo;{product.story}&rdquo;
          </p>
        )}
      </div>

      {/* Quantity & CTA Buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Quantity selector */}
        <div className="flex h-12 items-center border border-ivory-300 bg-white px-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center text-lg text-ink-600 hover:text-ink-900 active:scale-95"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-10 text-center text-sm font-semibold text-ink-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-8 w-8 items-center justify-center text-lg text-ink-600 hover:text-ink-900 active:scale-95"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Add to Bag Button */}
        <div className="flex-1">
          <AddToCartButton
            product={product}
            quantity={quantity}
            size="lg"
            className="w-full shadow-md"
          />
        </div>

      </div>

      {/* Accordion sections */}
      <div className="mt-8 divide-y divide-ivory-200 border-t border-ivory-200">
        {/* Care instructions */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('care')}
            className="flex w-full items-center justify-between text-left font-serif text-lg font-medium text-ink-900"
          >
            <span>Jewelry Care & Preservation</span>
            <ChevronDown
              className={`h-4 w-4 text-ink-500 transition-transform duration-200 ${
                openSection === 'care' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSection === 'care' && (
            <div className="mt-3 text-xs leading-relaxed text-ink-600">
              <p>
                {product.careInstructions ||
                  'Clean gently with a soft dry lint-free cloth after each wear. Keep away from harsh perfumes, hot tubs, and bleach. Store in the complimentary velvet pouch provided.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
