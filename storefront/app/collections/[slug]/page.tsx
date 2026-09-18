import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  getCollectionBySlug,
  getProductsByCollection,
  getCollections,
} from '@/lib/products';
import { ProductGrid } from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

export default async function SingleCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [collection, items, collections] = await Promise.all([
    getCollectionBySlug(slug),
    getProductsByCollection(slug),
    getCollections(),
  ]);

  if (!collection) {
    notFound();
  }

  const otherCollections = collections.filter((c) => c.slug !== slug);

  return (
    <main className="min-h-screen">
      {/* Hero Header */}
      <section className="relative flex min-h-[58vh] items-end overflow-hidden px-4 pb-12 pt-24 sm:px-6 sm:pb-16 lg:px-8">
        <Image
          src={collection.heroImage || collection.image}
          alt={collection.name}
          fill
          priority
          className="object-cover brightness-[0.7] filter"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink-900/45" />

        <div className="relative z-10 mx-auto w-full max-w-7xl text-ivory-50">
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-editorial text-gold-300 hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>All Collections</span>
          </Link>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-ivory-50 sm:text-8xl">
            {collection.name}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-ivory-200/90">
            {collection.description}
          </p>
        </div>
      </section>

      {/* Products in Collection */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
          <p className="eyebrow text-gold-700">Collection Portfolio</p>
          <span className="text-xs text-ink-500">
            {items.length} pieces curated
          </span>
        </div>

        <div className="mt-10">
          <ProductGrid
            products={items}
            columns={4}
            filter={{ collectionId: collection.id, collectionSlug: slug }}
            emptyTitle="No pieces in this collection currently"
            emptyDescription="New pieces are being selected for this collection."
          />
        </div>

        {/* Other collections exploration */}
        <div className="mt-24 border-t border-ivory-200 pt-16">
          <p className="text-xs uppercase tracking-editorial text-gold-700 font-medium text-center">
            Continue Exploring
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-center text-ink-900">
            Other Curated Collections
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {otherCollections.slice(0, 3).map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden bg-ivory-200 p-6 text-ivory-50 transition"
              >
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 640px) 33vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-transparent" />
                <div className="relative z-10">
                  <h3 className="font-serif text-xl font-medium">{col.name}</h3>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-gold-300">
                    View collection <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
