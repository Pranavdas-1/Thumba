'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS } from '@thumba/shared';

export function SortSelect({
  currentSort = 'featured',
}: {
  currentSort?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 border-b border-ink-900/30 pb-1">
      <label
        htmlFor="sort-select"
        className="text-[10px] uppercase tracking-[0.16em] text-ink-500"
      >
        Sort
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="bg-transparent px-1 py-1 text-xs text-ink-900 focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
