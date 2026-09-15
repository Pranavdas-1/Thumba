import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { collections, products } from '@/lib/products';

export default function CollectionsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="max-w-2xl">
        <p className="eyebrow text-gold-700">Curated Portfolios</p>
        <h1 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-ink-900 sm:text-7xl">
          Atelier Collections
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-ink-600">
          Each collection is curated around a distinct material and mood — warm
          gold, luminous pearls, cool silver, and ceremonial color.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-px border border-ivory-200 bg-ivory-200 md:grid-cols-2">
        {collections.map((col) => {
          const count = products.filter(
            (p) => p.collectionSlug === col.slug,
          ).length;

          return (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group relative flex aspect-[16/10] flex-col justify-end overflow-hidden bg-ivory-200 p-8 transition-[background-color] duration-300"
            >
              <Image
                src={col.heroImage || col.image}
                alt={col.name}
                fill
                className="object-cover transition-transform duration-700 ease-out-cubic group-hover:scale-105"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/40 to-transparent" />

              <div className="relative z-10 text-ivory-50">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-gold-300">
                    Collection • {count} Pieces
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-gold-200 group-hover:text-white transition-colors">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-4xl tracking-[-0.03em] sm:text-5xl">
                  {col.name}
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ivory-200">
                  {col.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
