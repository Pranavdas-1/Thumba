import { CATEGORY_LABELS } from '@thumba/shared';
import { getProducts } from '@/lib/products';
import { ProductGrid } from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
    collection?: string;
  }>;
}) {
  const { category, search, collection } = await searchParams;

  const products = await getProducts({ search });

  // 1. Filter by category
  let filtered =
    category && category !== 'all'
      ? products.filter((p) => p.category === category)
      : products;

  // 2. Filter by collection
  if (collection) {
    filtered = filtered.filter((p) => p.collectionSlug === collection);
  }

  const items = filtered;

  const activeCategoryLabel =
    category && category !== 'all' ? CATEGORY_LABELS[category] : 'All Pieces';

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-ivory-200 pb-10 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-gold-700">The Complete Collection</p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-ink-900 sm:text-7xl">
            {search ? `Results for “${search}”` : activeCategoryLabel}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-ink-600">
            A considered edit of gold, silver, pearls, and stones — each piece
            photographed to show its shape, surface, and scale.
          </p>
        </div>

        <span className="text-[10px] uppercase tracking-[0.16em] text-ink-500">
          {items.length} available pieces
        </span>
      </div>

      <div className="mt-12">
        <ProductGrid
          products={items}
          columns={4}
          emptyTitle="No available pieces match this view"
          emptyDescription="Try another part of the collection."
        />
      </div>
    </main>
  );
}
