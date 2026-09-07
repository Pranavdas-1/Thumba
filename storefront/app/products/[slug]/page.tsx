import Image from "next/image";
import { notFound } from "next/navigation";
import { formatCurrency } from "@thumba/shared";
import { AddToCartButton } from "@/components/AddToCartButton";
import { displayPrice, getProductBySlug } from "@/lib/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const price = displayPrice(product);

  return (
    <main className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ivory-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        ) : null}
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-700">{product.category}</p>
        <h1 className="mt-3 font-serif text-4xl text-ink-900 md:text-5xl">{product.name}</h1>
        <p className="mt-4 text-2xl text-gold-700">{formatCurrency(price)}</p>
        <p className="mt-6 leading-relaxed text-ink-700">{product.description}</p>
        <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-ink-700">Material</dt>
            <dd className="mt-1 text-ink-900">{product.material}</dd>
          </div>
          <div>
            <dt className="text-ink-700">Weight</dt>
            <dd className="mt-1 text-ink-900">{product.weight}</dd>
          </div>
        </dl>
        <div className="mt-10">
          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}
