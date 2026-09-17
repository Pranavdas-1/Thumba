import { CATEGORY_LABELS } from '@thumba/shared';
import { getProducts, displayPrice, sortProducts } from '@/lib/products';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ProductGrid } from '@/components/ProductGrid';
import { SortSelect } from '@/components/SortSelect';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    collection?: string;
    price?: string;
    search?: string;
    sort?: string;
  }>;
}) {
  const { category, collection, price, search, sort = 'featured' } = await searchParams;
  const products = await getProducts({ search });

  let filtered = category && category !== 'all'
    ? products.filter((product) => product.category === category)
    : products;

  if (collection) filtered = filtered.filter((product) => product.collectionSlug === collection);

  if (price === 'under-6000') filtered = filtered.filter((product) => displayPrice(product) < 6000);
  if (price === '6000-12000') filtered = filtered.filter((product) => displayPrice(product) >= 6000 && displayPrice(product) <= 12000);
  if (price === '12000-20000') filtered = filtered.filter((product) => displayPrice(product) >= 12000 && displayPrice(product) <= 20000);
  if (price === 'above-20000') filtered = filtered.filter((product) => displayPrice(product) > 20000);

  const items = sortProducts(filtered, sort);
  const activeCategoryLabel = category && category !== 'all'
    ? CATEGORY_LABELS[category] ?? 'Filtered pieces'
    : 'All pieces';

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="border-b border-ivory-200 pb-8 sm:pb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="eyebrow text-gold-700">The complete collection</p>
            <h1 className="mt-5 break-words font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-ink-900 sm:text-7xl">
              {search ? `Results for “${search}”` : activeCategoryLabel}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-ink-600">
              A considered edit of gold, silver, pearls, and stones — each piece photographed to show its shape, surface, and scale.
            </p>
          </div>

          <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end">
            <span className="text-[10px] uppercase tracking-[0.16em] text-ink-500">{items.length} available pieces</span>
            <SortSelect currentSort={sort} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:items-start">
        <FilterSidebar currentCategory={category} currentPrice={price} />
        <div className="min-w-0 flex-1">
          <ProductGrid
            products={items}
            columns={3}
            emptyTitle="No jewelry matches your filters"
            emptyDescription="Try clearing a category or price filter to see more of the available collection."
          />
        </div>
      </div>
    </main>
  );
}
