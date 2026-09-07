import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function HomePage() {
  const featured = products.slice(0, 3);

  return (
    <main>
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-ivory-50 via-ivory-100 to-ivory-50" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold-700">Est. for slow luxury</p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-ink-900 md:text-7xl">
            Wear your story
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink-700">
            Handcrafted jewelry in gold, pearl, and silver — pieces meant to be lived in, not locked away.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="rounded-full bg-ink-900 px-8 py-3 text-ivory-50 transition hover:bg-ink-800"
            >
              Shop the collection
            </Link>
            <Link
              href="/collections"
              className="rounded-full border border-gold-600 px-8 py-3 text-gold-700 transition hover:bg-ivory-100"
            >
              Browse collections
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-12 text-center font-serif text-4xl text-ink-900">Featured pieces</h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
