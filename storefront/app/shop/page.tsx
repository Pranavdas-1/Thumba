import { CATEGORY_LABELS } from '@thumba/shared';
import {
  products,
  sortProducts,
  searchProducts,
  displayPrice,
} from '@/lib/products';
import { ProductGrid } from '@/components/ProductGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import { SortSelect } from '@/components/SortSelect';
import { FilterChip } from '@/components/FilterChip';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    price?: string;
    instock?: string;
    search?: string;
  }>;
}) {
  const {
    category,
    sort = 'featured',
    price,
    instock,
    search,
  } = await searchParams;

  // 1. Filter by category
  let filtered =
    category && category !== 'all'
      ? products.filter((p) => p.category === category)
      : products;

  // 2. Filter by search query if any
  if (search) {
    filtered = searchProducts(filtered, search);
  }

  // 3. Filter by price range
  if (price) {
    if (price === 'under-6000') {
      filtered = filtered.filter((p) => displayPrice(p) < 6000);
    } else if (price === '6000-12000') {
      filtered = filtered.filter((p) => {
        const pr = displayPrice(p);
        return pr >= 6000 && pr <= 12000;
      });
    } else if (price === '12000-20000') {
      filtered = filtered.filter((p) => {
        const pr = displayPrice(p);
        return pr >= 12000 && pr <= 20000;
      });
    } else if (price === 'above-20000') {
      filtered = filtered.filter((p) => displayPrice(p) > 20000);
    }
  }

  // 4. Filter by stock
  if (instock === 'true') {
    filtered = filtered.filter((p) => p.inStock);
  }

  // 5. Apply sorting
  const items = sortProducts(filtered, sort);

  const activeCategoryLabel =
    category && category !== 'all' ? CATEGORY_LABELS[category] : 'All Pieces';

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Page Header */}
      <div className="border-b border-ivory-200 pb-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-gold-700">The Complete Collection</p>
            <h1 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-ink-900 sm:text-7xl">
              {search
                ? `Results for &ldquo;${search}&rdquo;`
                : activeCategoryLabel}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-ink-600">
              A considered edit of gold, silver, pearls, and stones — each
              piece photographed to show its shape, surface, and scale.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.16em] text-ink-500">
              {items.length} pieces
            </span>
            <SortSelect currentSort={sort} />
          </div>
        </div>

        {/* Quick category pills */}
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
          <FilterChip
            href="/shop"
            active={!category || category === 'all'}
            label="All Pieces"
          />
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <FilterChip
              key={key}
              href={`/shop?category=${key}`}
              active={category === key}
              label={label}
            />
          ))}
        </div>
      </div>

      {/* Main Content: Sidebar + Products */}
      <div className="mt-10 flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            currentCategory={category}
            currentSort={sort}
            currentPrice={price}
            currentInStock={instock === 'true'}
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid
            products={items}
            columns={3}
            emptyTitle="No jewelry matches your filters"
            emptyDescription="Try clearing your category, price, or stock filters to see the full atelier catalog."
          />
        </div>
      </div>
    </main>
  );
}
