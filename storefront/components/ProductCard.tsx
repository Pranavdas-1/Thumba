'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, discountPercentage } from '@thumba/shared';
import type { Product } from '@thumba/shared';
import { displayPrice } from '@/lib/products';
import { WishlistButton } from './WishlistButton';
import { QuickView } from './QuickView';
import { RatingStars } from './RatingStars';

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const price = displayPrice(product);
  const discountPct = discountPercentage(
    product.price,
    product.discountedPrice,
  );
  const secondaryImage = product.images[1];

  return (
    <div className="product-card group relative flex flex-col">
      {/* Image frame */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory-100">
        <Link
          href={`/products/${product.slug}`}
          className="block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-gold-600"
          tabIndex={0}
        >
          {/* Primary image */}
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority={priority}
              className="product-card-primary product-card-image object-cover"
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : null}

          {/* Secondary hover image crossfade */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate angle`}
              fill
              className="product-card-secondary product-card-image object-cover opacity-0"
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          )}
        </Link>

        {/* Top badges */}
        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-ivory-50/95 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-900">
              New
            </span>
          )}
          {discountPct > 0 && (
            <span className="bg-brand-700 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-ivory-50">
              {discountPct}% Off
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton product={product} size="sm" />
        </div>

        {/* Quick View trigger on hover */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center border-t border-ivory-50/60 bg-ink-900/75 px-3 py-3 opacity-0 transition-opacity duration-200 ease-out-cubic group-hover:opacity-100 focus-within:opacity-100">
          <QuickView product={product} />
        </div>
      </div>

      {/* Product metadata */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-700">
              {product.category}
            </span>
            <RatingStars
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="mt-2 block font-serif text-xl leading-tight tracking-[-0.02em] text-ink-900 transition-colors hover:text-gold-700 line-clamp-2"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-medium text-ink-900">
            {formatCurrency(price)}
          </span>
          {product.discountedPrice &&
            product.discountedPrice < product.price && (
              <span className="text-xs text-ink-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
        </div>
      </div>
    </div>
  );
}
