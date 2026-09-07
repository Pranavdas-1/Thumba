import { CATEGORY_LABELS } from "@thumba/shared";
import { ProductCard } from "@/components/ProductCard";
import { getProductsByCategory } from "@/lib/products";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const items = getProductsByCategory(category);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-4xl text-ink-900">Shop</h1>
      <p className="mt-2 text-ink-700">Every piece is photographed as it is made — no stock art, no filler SKUs.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        <FilterChip href="/shop" active={!category || category === "all"} label="All" />
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <FilterChip
            key={key}
            href={`/shop?category=${key}`}
            active={category === key}
            label={label}
          />
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <a
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm ${
        active ? "bg-ink-900 text-ivory-50" : "border border-ivory-200 text-ink-700 hover:border-gold-500"
      }`}
    >
      {label}
    </a>
  );
}
