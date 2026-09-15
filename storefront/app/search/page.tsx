import { searchProducts, products } from '@/lib/products';
import { ProductGrid } from '@/components/ProductGrid';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const results = q ? searchProducts(products, q) : [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-gold-700">Jewelry Search</p>
        <h1 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-ink-900 sm:text-7xl">
          {q ? `Search for &ldquo;${q}&rdquo;` : 'Search Our Jewelry'}
        </h1>

        {/* Search input form */}
        <form action="/search" method="GET" className="mt-8 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by piece, gemstone, gold karat, or collection…"
              className="w-full border-b border-ivory-300 bg-transparent py-3 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn-press bg-ink-900 px-7 py-3 text-xs font-medium uppercase tracking-wider text-ivory-50 transition-colors hover:bg-ink-800"
          >
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-ink-500">
          <span>Popular:</span>
          {['Pearl', 'Hoops', 'Signet', 'Solitaire', 'Vermeil', 'Bridal'].map(
            (term) => (
              <Link
                key={term}
                href={`/search?q=${term}`}
                className="text-gold-700 underline hover:text-gold-900"
              >
                {term}
              </Link>
            ),
          )}
        </div>
      </div>

      <div className="mt-16 border-t border-ivory-200 pt-10">
        {q ? (
          <div>
            <p className="mb-8 text-xs text-ink-500">
              Found {results.length} {results.length === 1 ? 'piece' : 'pieces'}{' '}
              matching &quot;{q}&quot;
            </p>
            <ProductGrid
              products={results}
              columns={4}
              emptyTitle={`No pieces found for "${q}"`}
              emptyDescription="Try checking for spelling or searching for a broader term like 'necklace', 'gold', or 'pearl'."
            />
          </div>
        ) : (
          <div>
            <p className="mb-8 text-center font-serif text-2xl text-ink-900">
              Recommended Pieces
            </p>
            <ProductGrid products={products.slice(0, 8)} columns={4} />
          </div>
        )}
      </div>
    </main>
  );
}
