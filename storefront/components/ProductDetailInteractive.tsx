'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Sparkles } from 'lucide-react';
import { formatCurrency, discountPercentage } from '@thumba/shared';
import type { Product } from '@thumba/shared';
import { displayPrice } from '@/lib/products';
import { AddToCartButton } from './AddToCartButton';
import { WishlistButton } from './WishlistButton';
import { RatingStars } from './RatingStars';

export function ProductDetailInteractive({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants?.[0]?.name,
  );
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>('details');

  const price = displayPrice(product);
  const discountPct = discountPercentage(
    product.price,
    product.discountedPrice,
  );

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="flex flex-col">
      {/* Category & Rating Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/shop?category=${product.category}`}
          className="text-xs uppercase tracking-editorial text-gold-700 font-medium hover:text-gold-800"
        >
          {product.category}
        </Link>
        <a href="#reviews" className="hover:opacity-80 transition-opacity">
          <RatingStars
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </a>
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
          {formatCurrency(price)}
        </span>
        {product.discountedPrice && product.discountedPrice < product.price && (
          <span className="text-base text-ink-400 line-through">
            {formatCurrency(product.price)}
          </span>
        )}
        {discountPct > 0 && (
          <span className="bg-brand-700 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-ivory-50">
            Save {discountPct}%
          </span>
        )}
      </div>
      {false && (
        <p className="mt-1 text-[11px] text-ink-500">
        Includes all taxes and duties • Free shipping across India
        </p>
      )}

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

      {/* Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold uppercase tracking-wider text-ink-800">
              Select Size / Option:
            </label>
            <span className="text-gold-700 font-medium">{selectedVariant}</span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-2.5">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v.name)}
                className={`rounded-xl border px-4 py-2 text-xs font-medium transition-all duration-160 active:scale-95 ${
                  selectedVariant === v.name
                    ? 'border-ink-900 bg-ink-900 text-ivory-50 shadow-sm'
                    : 'border-ivory-300 bg-white text-ink-800 hover:border-gold-500'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

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
            variantName={selectedVariant}
            quantity={quantity}
            size="lg"
            className="w-full shadow-md"
          />
        </div>

        {/* Wishlist Button */}
        <div className="flex justify-center sm:justify-start">
          <WishlistButton
            product={product}
            className="h-12 w-12 border border-ivory-300 shadow-sm"
          />
        </div>
      </div>

      {/* Accordion sections */}
      <div className="mt-8 divide-y divide-ivory-200 border-t border-ivory-200">
        {/* Craft Details */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('details')}
            className="flex w-full items-center justify-between text-left font-serif text-lg font-medium text-ink-900"
          >
            <span>Material & Craft Specifications</span>
            <ChevronDown
              className={`h-4 w-4 text-ink-500 transition-transform duration-200 ${
                openSection === 'details' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSection === 'details' && (
            <div className="mt-3 space-y-2 text-xs leading-relaxed text-ink-600">
              <p>
                <strong className="text-ink-900">Material:</strong>{' '}
                {product.material}
              </p>
              <p>
                <strong className="text-ink-900">Approximate Weight:</strong>{' '}
                {product.weight}
              </p>
              {product.dimensions && (
                <p>
                  <strong className="text-ink-900">Dimensions:</strong>{' '}
                  {product.dimensions}
                </p>
              )}
              {product.details && product.details.length > 0 && (
                <ul className="mt-2 list-inside list-disc space-y-1 text-ink-700">
                  {product.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

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
