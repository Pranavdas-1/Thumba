import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/products';
import { ProductGrid } from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

export default async function NewArrivalsPage() {
  const products = (await getProducts()).filter((product) => product.isNew);

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="flex flex-col justify-between gap-8 border-b border-ivory-200 pb-10 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-gold-700">New from the collection</p>
          <h1 className="mt-5 max-w-2xl font-serif text-5xl leading-[0.92] tracking-[-0.04em] text-ink-900 sm:text-7xl">
            New arrivals
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-ink-600">
            The latest silhouettes, selected in small batches and ready to become part of your daily rotation.
          </p>
        </div>
        <Link href="/shop" className="link-underline inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-900">
          Shop every piece <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12">
        <ProductGrid
          products={products}
          columns={4}
          emptyTitle="New pieces are on the way"
          emptyDescription="Check back soon for the next selection."
        />
      </div>
    </main>
  );
}
