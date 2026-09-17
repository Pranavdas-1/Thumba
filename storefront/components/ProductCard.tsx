import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@thumba/shared';
import type { Product } from '@thumba/shared';
import { displayPrice } from '@/lib/products';

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const images = product.images.filter(Boolean);
  const primaryImage = images[0];
  const hoverImage = images[1];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card group relative block outline-none focus-visible:ring-2 focus-visible:ring-gold-600"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory-100">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            priority={priority}
            className="product-card-image object-cover opacity-100 transition-opacity duration-700 ease-out sm:group-hover:opacity-0 sm:group-focus-within:opacity-0"
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : null}
        {hoverImage ? (
          <Image
            src={hoverImage}
            alt=""
            aria-hidden="true"
            fill
            className="product-card-image object-cover opacity-0 transition-opacity duration-700 ease-out sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : null}
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-700">{product.category}</span>
          <h2 className="mt-2 line-clamp-2 font-serif text-2xl leading-[0.95] tracking-[-0.02em] text-ink-900 transition-colors group-hover:text-gold-700">
            {product.name}
          </h2>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-sm font-medium text-ink-900">{formatCurrency(displayPrice(product))}</span>
        </div>
      </div>
    </Link>
  );
}
