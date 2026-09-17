import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getCollections, getProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { editorialImages } from '@/lib/image-library';

export const dynamic = 'force-dynamic';

const collectionImages: Record<string, string> = {
  'timeless-gold': editorialImages.collections.gold,
  'the-pearl-edit': editorialImages.collections.pearl,
  'silver-moon': editorialImages.collections.silver,
  heritage: editorialImages.collections.heritage,
};

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const newArrivals = products.filter((product) => product.isNew).slice(0, 4);

  return (
    <main className="bg-ivory-50">
      <section className="relative isolate min-h-[760px] overflow-hidden bg-ink-900 text-ivory-50 lg:min-h-[100svh]">
        <Image
          src={editorialImages.hero}
          alt="A sculptural gold necklace from the Thumba atelier"
          fill
          priority
          className="object-cover object-center brightness-[0.55] contrast-125"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/85 via-ink-900/45 to-ink-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/10 to-ink-900/25" />

        <div className="relative mx-auto flex min-h-[760px] max-w-7xl flex-col justify-end px-4 pb-36 pt-32 sm:px-6 lg:min-h-[100svh] lg:px-8">
          <div className="relative max-w-2xl">
            <svg
              aria-hidden="true"
              viewBox="0 0 180 180"
              className="pointer-events-none absolute -left-10 -top-16 h-44 w-44 text-gold-200/45 sm:-left-14 sm:-top-20 sm:h-56 sm:w-56"
              fill="none"
            >
              <circle cx="90" cy="90" r="61" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="90" cy="90" r="42" stroke="currentColor" strokeDasharray="2 6" strokeWidth="0.8" />
              <path d="M90 8v164M8 90h164" stroke="currentColor" strokeWidth="0.8" />
              <path d="M90 24v12M90 144v12M24 90h12M144 90h12" stroke="currentColor" strokeWidth="2" />
            </svg>
            <p className="eyebrow relative text-gold-200">Fine jewelry, made slowly</p>
            <h1 className="display-title relative mt-6 max-w-xl text-ivory-50">Objects with a pulse.</h1>
            <p className="relative mt-7 max-w-lg text-sm leading-7 text-ivory-200 sm:text-base">
              Sculptural pieces in gold, luminous pearls, and silver with a
              quiet point of view. Made to become part of your every day.
            </p>
            <Link
              href="/shop"
              className="btn-press relative mt-9 inline-flex items-center gap-4 border border-gold-300 bg-gold-300 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink-900 hover:bg-gold-200"
            >
              Enter the atelier
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-ivory-300">
          <span>Scroll to explore</span>
          <span className="h-8 w-px bg-gold-300/70" />
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-ivory-50/20 bg-ink-900/40 backdrop-blur-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-ivory-50/20 px-4 sm:px-6 lg:px-8">
            <div className="py-4 pr-3 sm:py-5">
              <p className="text-[9px] uppercase tracking-[0.16em] text-ivory-400 sm:text-[10px]">Material</p>
              <p className="mt-1 text-xs text-ivory-100 sm:text-sm">18k gold &amp; sterling silver</p>
            </div>
            <div className="px-3 py-4 sm:px-6 sm:py-5">
              <p className="text-[9px] uppercase tracking-[0.16em] text-ivory-400 sm:text-[10px]">Starting price</p>
              <p className="mt-1 text-xs text-ivory-100 sm:text-sm">₹4,600</p>
            </div>
            <div className="py-4 pl-3 sm:py-5 sm:pl-6">
              <p className="text-[9px] uppercase tracking-[0.16em] text-ivory-400 sm:text-[10px]">Pieces available</p>
              <p className="mt-1 text-xs text-ivory-100 sm:text-sm">{products.length} considered pieces</p>
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
              <h2 className="mt-4 font-serif text-4xl tracking-[-0.04em] sm:text-6xl">Find your element.</h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-ivory-300">Four distinct moods, one point of view: jewelry that gets better with wear.</p>
          </div>

          <div className="mt-8 grid grid-cols-1 divide-y divide-ivory-700 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {collections.map((collection, index) => {
              const image = collectionImages[collection.slug] || collection.heroImage || collection.image || editorialImages.collections.heritage;
              return (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className={`group relative grid min-h-[22rem] grid-cols-[4.5rem_1fr] items-end overflow-hidden p-5 sm:min-h-[26rem] sm:p-7 ${index > 1 ? 'border-t border-ivory-700' : ''}`}
                >
                  <span className="self-start pt-1 font-serif text-2xl text-gold-300">0{index + 1}</span>
                  <Image src={image} alt="" fill className="-z-10 object-cover opacity-45 transition-transform duration-700 ease-out-cubic group-hover:scale-105" sizes="(min-width: 640px) 50vw, 100vw" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
                  <div className="relative col-start-2">
                    <p className="eyebrow text-gold-300">{collection.tagline}</p>
                    <h3 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-ivory-50 sm:text-4xl">{collection.name}</h3>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ivory-200 transition-colors group-hover:text-gold-200">Explore edit <ArrowRight className="h-3.5 w-3.5" /></span>
                  </div>
                </Link>
              );
            })}
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
