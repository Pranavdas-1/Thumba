'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORY_LABELS } from '@thumba/shared';

const priceRanges = [
  { label: 'All prices', value: '' },
  { label: 'Under ₹6,000', value: 'under-6000' },
  { label: '₹6,000 – ₹12,000', value: '6000-12000' },
  { label: '₹12,000 – ₹20,000', value: '12000-20000' },
  { label: 'Above ₹20,000', value: 'above-20000' },
];

export function FilterSidebar({
  currentCategory,
  currentPrice,
}: {
  currentCategory?: string;
  currentPrice?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || (key === 'category' && value === 'all')) params.delete(key);
    else params.set(key, value);
    router.push(`/shop?${params.toString()}`);
  };

  const hasActiveFilters = Boolean(
    (currentCategory && currentCategory !== 'all') || currentPrice,
  );

  return (
    <aside className="w-full shrink-0 border border-ivory-200 bg-white p-5 lg:sticky lg:top-28 lg:w-64 lg:border-0 lg:bg-transparent lg:p-0">
      <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
        <h2 className="font-serif text-xl text-ink-900">Refine pieces</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => router.push('/shop')}
            className="text-xs text-gold-700 underline hover:text-gold-900"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-7 sm:grid-cols-2 lg:block">
        <div>
          <h3 className="eyebrow text-gold-700">Jewelry type</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 lg:block lg:space-y-2">
            <li>
              <button
                type="button"
                onClick={() => updateParam('category', null)}
                className={`text-xs transition-colors ${!currentCategory || currentCategory === 'all' ? 'font-semibold text-ink-900 underline underline-offset-4' : 'text-ink-600 hover:text-ink-900'}`}
              >
                All categories
              </button>
            </li>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => updateParam('category', key)}
                  className={`text-xs transition-colors ${currentCategory === key ? 'font-semibold text-ink-900 underline underline-offset-4' : 'text-ink-600 hover:text-ink-900'}`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:mt-8">
          <h3 className="eyebrow text-gold-700">Price range</h3>
          <ul className="mt-3 space-y-2">
            {priceRanges.map((range) => (
              <li key={range.value}>
                <button
                  type="button"
                  onClick={() => updateParam('price', range.value || null)}
                  className={`text-xs transition-colors ${(currentPrice || '') === range.value ? 'font-semibold text-ink-900 underline underline-offset-4' : 'text-ink-600 hover:text-ink-900'}`}
                >
                  {range.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
