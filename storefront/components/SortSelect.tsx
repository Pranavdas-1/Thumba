'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export function SortSelect({ currentSort = 'featured' }: { currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'featured') params.delete('sort');
    else params.set('sort', value);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <label className="flex min-w-0 items-center gap-2 border-b border-ink-900/30 pb-1">
      <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-ink-500">Sort</span>
      <select
        aria-label="Sort products"
        value={sortOptions.some((option) => option.value === currentSort) ? currentSort : 'featured'}
        onChange={(event) => handleSortChange(event.target.value)}
        className="min-w-0 max-w-[12rem] bg-transparent px-1 py-1 text-xs text-ink-900 focus:outline-none"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
