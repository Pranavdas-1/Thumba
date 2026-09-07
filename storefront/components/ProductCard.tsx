import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@thumba/shared";
import type { Product } from "@thumba/shared";
import { displayPrice } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const price = displayPrice(product);
  const hasDiscount = product.discountedPrice != null && product.discountedPrice < product.price;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ivory-100">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        ) : null}
      </div>
      <div className="mt-4">
        <h3 className="font-serif text-xl text-ink-900">{product.name}</h3>
        <p className="mt-1 text-sm text-ink-700 capitalize">{product.category}</p>
        <p className="mt-2 text-gold-700">
          {formatCurrency(price)}
          {hasDiscount ? (
            <span className="ml-2 text-sm text-ink-700 line-through">
              {formatCurrency(product.price)}
            </span>
          ) : null}
        </p>
      </div>
    </Link>
  );
}
