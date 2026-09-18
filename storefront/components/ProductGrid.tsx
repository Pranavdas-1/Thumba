'use client';

import type { Product } from '@thumba/shared';
import type { ProductRealtimeFilter } from '@thumba/shared';
import { ProductCard } from './ProductCard';
import { useLiveProducts } from '@/lib/use-live-products';

type ProductGridProps = {
  products: Product[];
  columns?: 3 | 4;
  emptyTitle?: string;
  emptyDescription?: string;
  filter?: ProductRealtimeFilter;
};

export function ProductGrid({
  products,
  columns = 4,
  emptyTitle = 'No jewelry found',
  emptyDescription = 'Try another part of the collection.',
  filter = {},
}: ProductGridProps) {
  const liveProducts = useLiveProducts(products, filter);

  if (liveProducts.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center border border-dashed border-ivory-300 p-12 text-center">
        <p className="font-serif text-2xl text-ink-900">{emptyTitle}</p>
        <p className="mt-2 max-w-md text-sm text-ink-600">{emptyDescription}</p>
      </div>
    );
  }

  const gridColsClass =
    columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`grid gap-x-4 gap-y-14 sm:gap-x-6 ${gridColsClass}`}>
      {liveProducts.map((product, idx) => (
        <div
          key={product.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${Math.min(idx * 40, 400)}ms` }}
        >
          <ProductCard product={product} priority={idx < 4} />
        </div>
      ))}
    </div>
  );
}
