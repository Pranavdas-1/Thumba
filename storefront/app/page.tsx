import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getCollections, getProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { editorialImages } from '@/lib/image-library';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const newArrivals = products.filter((product) => product.isNew).slice(0, 4);

  return (
    <main className="bg-ivory-50">
      <section className="mx-auto max-w-[1600px] px-4 pb-4 pt-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="flex flex-col justify-between bg-ink-900 px-7 py-9 text-ivory-50 sm:px-12 sm:py-12 lg:px-16 lg:py-14">
            <div className="flex items-center justify-between text-gold-300">
              <p className="eyebrow">Thumba / 01</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ivory-400">
                Autumn 2026
              </p>
            </div>

            <div className="my-16 max-w-xl lg:my-10">
              <p className="eyebrow text-gold-300">Fine jewelry, made slowly</p>
              <h1 className="display-title mt-7 text-ivory-50">
                Objects
                <br />
                with a pulse.
              </h1>
              <p className="mt-8 max-w-md text-sm leading-7 text-ivory-300 sm:text-base">
                Sculptural pieces in gold, luminous pearls, and silver with a
                quiet point of view. Made to become part of your every day.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link
                  href="/shop"
                  className="btn-press inline-flex items-center gap-4 border border-gold-300 bg-gold-300 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink-900 hover:bg-gold-200"
                >
                  Enter the atelier
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/collections"
                  className="link-underline text-xs uppercase tracking-[0.16em] text-ivory-200 hover:text-white"
                >
                  View collections
                </Link>
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-ivory-700 pt-5 text-[10px] uppercase tracking-[0.18em] text-ivory-400">
              <span>Fine jewelry, quietly considered</span>
              <span>01 — 04</span>
            </div>
          </div>

          <div className="group relative aspect-[16/9] overflow-hidden bg-ivory-200">
            <Image
              src={editorialImages.hero}
              alt="A sculptural gold necklace from the Thumba atelier"
              fill
              priority
              className="image-lift object-cover object-center"
              sizes="(min-width: 1024px) 65vw, 100vw"
            />
            <div className="absolute inset-0 bg-ink-900/10" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between border-t border-ivory-50/50 bg-ink-900/35 px-6 py-5 text-ivory-50 backdrop-blur-sm sm:px-8">
              <div>
                <p className="eyebrow text-gold-200">The Nila pearl necklace</p>
                <p className="mt-2 font-serif text-xl">
                  A soft glimmer, held close.
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.16em] text-ivory-200">
                01 / 04
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-start lg:gap-20">
          <div>
            <p className="eyebrow text-gold-700">The signature edit</p>
            <h2 className="mt-5 max-w-sm font-serif text-4xl leading-[0.98] tracking-[-0.04em] text-ink-900 sm:text-6xl">Pieces that hold their own.</h2>
            <p className="mt-7 max-w-sm text-sm leading-7 text-ink-600">A considered edit of our most-worn silhouettes. Selected with enough presence for the room, and enough ease for the morning after.</p>
            <Link href="/shop" className="link-underline mt-9 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-900">Shop all pieces <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6">
            {featured.map((product, index) => <div key={product.id} className={index === 1 ? 'sm:mt-20 lg:mt-0' : ''}><ProductCard product={product} priority={index < 2} /></div>)}
          </div>
        </div>
      </section>

      <section className="bg-ink-900 py-24 text-ivory-50 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 border-b border-ivory-700 pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-gold-300">Curated by material</p>
              <h2 className="mt-4 font-serif text-4xl tracking-[-0.04em] sm:text-6xl">
                Find your element.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-ivory-300">
              Four distinct moods, one point of view: jewelry that gets better
              with wear.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 divide-y divide-ivory-700 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {collections.map((collection, index) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className={`group relative grid min-h-[22rem] grid-cols-[4.5rem_1fr] items-end overflow-hidden p-5 sm:min-h-[26rem] sm:p-7 ${index > 1 ? 'border-t border-ivory-700' : ''}`}
              >
                <span className="self-start pt-1 font-serif text-2xl text-gold-300">
                  0{index + 1}
                </span>
                <Image
                  src={collection.image}
                  alt=""
                  fill
                  className="-z-10 object-cover opacity-45 transition-transform duration-700 ease-out-cubic group-hover:scale-105"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
                <div className="relative col-start-2">
                  <p className="eyebrow text-gold-300">{collection.tagline}</p>
                  <h3 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-ivory-50 sm:text-4xl">
                    {collection.name}
                  </h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ivory-200 transition-colors group-hover:text-gold-200">
                    Explore edit <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-ivory-200 bg-ivory-100/60 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="eyebrow text-gold-700">Newly selected</p><h2 className="mt-4 font-serif text-4xl tracking-[-0.04em] text-ink-900 sm:text-6xl">New, but already familiar.</h2></div>
            <Link href="/new-arrivals" className="link-underline inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-900">See the latest <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 lg:grid-cols-4">{newArrivals.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 2} />)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <p className="eyebrow text-gold-700">A note from our collectors</p>
        <blockquote className="mx-auto mt-8 max-w-4xl font-serif text-3xl leading-tight tracking-[-0.03em] text-ink-900 sm:text-5xl">“The kind of jewelry that makes a simple white shirt feel considered.”</blockquote>
        <p className="mt-8 text-xs uppercase tracking-[0.18em] text-ink-500">— Shreya Nair, Kochi</p>
      </section>
    </main>
  );
}
