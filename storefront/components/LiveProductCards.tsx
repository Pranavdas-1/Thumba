'use client';

import type { Product, ProductRealtimeFilter } from '@thumba/shared';
import { ProductCard } from './ProductCard';
import { useLiveProducts } from '@/lib/use-live-products';

export function LiveProductCards({
  initialProducts,
  filter,
  variant,
}: {
  initialProducts: Product[];
  filter: ProductRealtimeFilter;
  variant: 'featured' | 'new-arrivals';
}) {
  const products = useLiveProducts(initialProducts, filter);

  return (
    <div className={variant === 'featured'
      ? 'grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6'
      : 'grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 lg:grid-cols-4'}>
      {products.map((product, index) => (
        <div
          key={product.id}
          className={variant === 'featured' && index === 1 ? 'sm:mt-20 lg:mt-0' : undefined}
        >
          <ProductCard product={product} priority={index < 2} />
        </div>
      ))}
    </div>
  );
}
