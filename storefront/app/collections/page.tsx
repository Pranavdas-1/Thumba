import Link from "next/link";
import { CATEGORY_LABELS } from "@thumba/shared";

export default function CollectionsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-4xl text-ink-900">Collections</h1>
      <p className="mt-2 max-w-xl text-ink-700">
        Shop by form. Each collection is small on purpose — we restock when the atelier is ready, not when a calendar says so.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <Link
            key={key}
            href={`/shop?category=${key}`}
            className="rounded-2xl border border-ivory-200 bg-ivory-50 p-8 transition hover:border-gold-500"
          >
            <h2 className="font-serif text-2xl text-ink-900">{label}</h2>
            <p className="mt-2 text-sm text-ink-700">View pieces</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
