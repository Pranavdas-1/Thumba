import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/products";
import { ImageGallery } from "@/components/ImageGallery";
import { ProductDetailInteractive } from "@/components/ProductDetailInteractive";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Jewel Not Found" };

  return {
    title: `${product.name} — Curated Fine Jewelry`,
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
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const availableProducts = await getProducts();
  const relatedProducts = [
    ...availableProducts.filter((item) => item.id !== product.id && item.category === product.category),
    ...availableProducts.filter((item) => item.id !== product.id && item.category !== product.category),
  ].slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-ink-500" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-ink-900">Home</Link>
        <ChevronRight className="h-3 w-3 text-ivory-400" />
        <Link href="/shop" className="transition-colors hover:text-ink-900">Shop</Link>
        <ChevronRight className="h-3 w-3 text-ivory-400" />
        <Link href={`/shop?category=${product.category}`} className="capitalize transition-colors hover:text-ink-900">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3 text-ivory-400" />
        <span className="truncate font-medium text-ink-900" aria-current="page">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7"><ImageGallery images={product.images} title={product.name} /></div>
        <div className="lg:col-span-5"><ProductDetailInteractive product={product} /></div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-ivory-200 pt-12 sm:mt-24 sm:pt-16">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-editorial text-gold-700">Complements</p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-ink-900">You may also adore</h2>
            </div>
            <Link href={`/shop?category=${product.category}`} className="text-xs font-semibold uppercase tracking-wider text-gold-800 hover:text-gold-900">
              View all {product.category} →
            </Link>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {relatedProducts.map((relatedProduct, index) => (
              <div key={relatedProduct.id} className="w-[78vw] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
                <ProductCard product={relatedProduct} priority={index < 2} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
