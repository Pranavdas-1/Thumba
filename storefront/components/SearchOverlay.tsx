'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, X, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@thumba/shared';
import { products, searchProducts, displayPrice } from '@/lib/products';

export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(products, query).slice(0, 6);
  }, [query]);

  // Keyboard shortcut: Cmd/Ctrl + K or "/" opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
        (e.key === '/' &&
          !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName))
      ) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const popularSearches = [
    'Pearl Necklace',
    'Hoop Earrings',
    'Signet Ring',
    'Bridal Set',
    'Emerald',
    'Cuff',
  ];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Search jewelry catalog"
          className="flex items-center gap-2 border-b border-ink-900/30 px-1 py-2 text-xs text-ink-600 transition-colors hover:border-gold-600 hover:text-ink-900"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search pieces…</span>
          <kbd className="hidden rounded bg-ivory-200/60 px-1.5 py-0.5 text-[10px] text-ink-500 md:inline-block">
            ⌘K
          </kbd>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm transition-opacity duration-200" />
        <Dialog.Content className="fixed left-1/2 top-20 z-50 w-[94vw] max-w-2xl -translate-x-1/2 border border-ivory-200 bg-ivory-50 p-6 shadow-2xl transition-transform duration-200 ease-out-cubic focus:outline-none">
          <Dialog.Title className="sr-only">
            Search the Thumba jewelry catalog
          </Dialog.Title>
          <div className="relative flex items-center border-b border-ivory-200 pb-4">
            <Search className="h-5 w-5 text-gold-700" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by piece name, category, or material…"
              className="w-full bg-transparent pl-3 pr-8 text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-0 text-ink-400 hover:text-ink-800"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick searches when query is empty */}
          {!query.trim() && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wider text-ink-500">
                Popular Searches
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="border-b border-ivory-300 px-1 py-1.5 text-xs text-ink-700 transition-colors hover:border-gold-500 hover:text-gold-700"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Search Results */}
          {query.trim() && (
            <div className="mt-6 max-h-[60vh] overflow-y-auto">
              {results.length > 0 ? (
                <div className="divide-y divide-ivory-200">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-4 border-b border-ivory-200 px-2 py-3 transition-colors hover:bg-ivory-100/60"
                    >
                      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-ivory-200">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-editorial text-gold-700">
                          {product.category}
                        </p>
                        <p className="font-serif text-base text-ink-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-ink-500">
                          {product.material}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-ink-900">
                          {formatCurrency(displayPrice(product))}
                        </p>
                        <span className="text-xs text-gold-700 flex items-center justify-end gap-1 mt-0.5">
                          View <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                  <div className="pt-4 text-center">
                    <Link
                      href={`/shop?search=${encodeURIComponent(query)}`}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-700 underline hover:text-gold-800"
                    >
                      <span>View all results for &quot;{query}&quot;</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-ink-600">
                  No jewelry matching &quot;{query}&quot;. Try searching for
                  &quot;pearl&quot;, &quot;hoop&quot;, or &quot;gold&quot;.
                </div>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
