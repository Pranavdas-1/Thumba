import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import {
  getProductBySlug,
  getProductsByCategory,
  getReviewsForProduct,
  products,
} from "@/lib/products";
import { ImageGallery } from "@/components/ImageGallery";
import { ProductDetailInteractive } from "@/components/ProductDetailInteractive";
import { ProductGrid } from "@/components/ProductGrid";
import { RatingStars } from "@/components/RatingStars";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Jewel Not Found",
    };
  }

  return {
    title: `${product.name} — Handcrafted Fine Jewelry`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Thumba Fine Jewelry`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = getReviewsForProduct(product.id);
  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb navigation */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-ink-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-ivory-400" />
        <Link href="/shop" className="hover:text-ink-900 transition-colors">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3 text-ivory-400" />
        <Link
          href={`/shop?category=${product.category}`}
          className="capitalize hover:text-ink-900 transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3 text-ivory-400" />
        <span className="truncate font-medium text-ink-900" aria-current="page">
          {product.name}
        </span>
      </nav>

      {/* Main 2-column Product presentation */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left 7 cols: Image gallery */}
        <div className="lg:col-span-7">
          <ImageGallery images={product.images} title={product.name} />
        </div>

        {/* Right 5 cols: Purchase & details panel */}
        <div className="lg:col-span-5">
          <ProductDetailInteractive product={product} />
        </div>
      </div>

      {/* Reviews Section */}
      <section id="reviews" className="mt-24 border-t border-ivory-200 pt-16">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-editorial text-gold-700 font-medium">
              Verified Patron Experience
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold text-ink-900">
              Customer Reviews ({reviews.length})
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <RatingStars rating={product.rating} showCount={false} size="md" />
            <span className="font-serif text-xl font-medium text-ink-900">
              {product.rating.toFixed(1)} out of 5.0
            </span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-ivory-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <RatingStars rating={r.rating} showCount={false} />
                <span className="text-xs text-ink-400">{r.date}</span>
              </div>
              <h3 className="mt-3 font-serif text-lg font-medium text-ink-900">{r.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-600">{r.comment}</p>
              <div className="mt-4 flex items-center gap-2 border-t border-ivory-200 pt-3 text-xs text-ink-500">
                <span className="font-medium text-ink-900">{r.author}</span>
                {r.location && <span>• {r.location}</span>}
                {r.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gold-700 ml-auto">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified Purchase
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 border-t border-ivory-200 pt-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-editorial text-gold-700 font-medium">
                Complements
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-ink-900">
                You may also adore
              </h2>
            </div>
            <Link
              href={`/shop?category=${product.category}`}
              className="text-xs font-semibold uppercase tracking-wider text-gold-800 hover:text-gold-900"
            >
              View all {product.category} →
            </Link>
          </div>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}
    </main>
  );
}
