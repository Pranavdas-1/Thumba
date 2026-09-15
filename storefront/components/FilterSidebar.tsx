'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORY_LABELS } from '@thumba/shared';

export function FilterSidebar({
  currentCategory,
  currentSort,
  currentPrice,
  currentInStock,
}: {
  currentCategory?: string;
  currentSort?: string;
  currentPrice?: string;
  currentInStock?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (
      value === null ||
      value === '' ||
      (key === 'category' && value === 'all')
    ) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under ₹6,000', value: 'under-6000' },
    { label: '₹6,000 – ₹12,000', value: '6000-12000' },
    { label: '₹12,000 – ₹20,000', value: '12000-20000' },
    { label: 'Above ₹20,000', value: 'above-20000' },
  ];

  const hasActiveFilters =
    Boolean(currentCategory && currentCategory !== 'all') ||
    Boolean(currentPrice) ||
    Boolean(currentInStock);

  return (
    <aside className="w-64 flex-shrink-0 space-y-10 pr-8">
      <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
        <h2 className="font-serif text-xl text-ink-900">Refine pieces</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => router.push('/shop')}
            className="text-xs text-gold-700 underline hover:text-gold-900"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="eyebrow text-gold-700">Category</h3>
        <ul className="mt-3 space-y-2">
          <li>
            <button
              type="button"
              onClick={() => updateParam('category', null)}
              className={`text-xs transition-colors ${
                !currentCategory || currentCategory === 'all'
                  ? 'font-semibold text-ink-900 underline underline-offset-4'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              All Categories
            </button>
          </li>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => updateParam('category', key)}
                className={`text-xs transition-colors ${
                  currentCategory === key
                    ? 'font-semibold text-ink-900 underline underline-offset-4'
                    : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="eyebrow text-gold-700">Price Range</h3>
        <ul className="mt-3 space-y-2">
          {priceRanges.map((range) => (
            <li key={range.value}>
              <button
                type="button"
                onClick={() => updateParam('price', range.value || null)}
                className={`text-xs transition-colors ${
                  (currentPrice || '') === range.value
                    ? 'font-semibold text-ink-900 underline underline-offset-4'
                    : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                {range.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Availability */}
      <div>
        <h3 className="eyebrow text-gold-700">Availability</h3>
        <label className="mt-3 flex items-center gap-2 cursor-pointer text-xs text-ink-700 hover:text-ink-900">
          <input
            type="checkbox"
            checked={Boolean(currentInStock)}
            onChange={(e) =>
              updateParam('instock', e.target.checked ? 'true' : null)
            }
            className="h-4 w-4 rounded border-ivory-300 text-ink-900 focus:ring-gold-500"
          />
          <span>In stock only</span>
        </label>
      </div>
    </aside>
  );
}
