'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { BRAND } from '@thumba/shared';
import { useCartStore } from '@/lib/cart-store';
import { MobileNav } from './MobileNav';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/new-arrivals', label: 'New Arrivals' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-[background-color,box-shadow] duration-250 ease-out-cubic ${scrolled ? 'border-ivory-200 bg-ivory-50/95 shadow-[0_10px_30px_rgba(33,30,26,0.06)] backdrop-blur-md' : 'border-ivory-200/70 bg-ivory-50/90 backdrop-blur-sm'}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-1 px-4 py-3.5 sm:gap-5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Link href="/" className="group shrink-0 outline-none" aria-label="Thumba home">
            <span className="font-serif text-2xl font-semibold tracking-[0.14em] text-ink-900 transition-colors group-hover:text-gold-700 sm:text-3xl">
              {BRAND.name}
            </span>
            <span className="mt-0.5 hidden text-[8px] uppercase tracking-[0.32em] text-ink-500 sm:block">
              Fine jewelry collection
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-600 md:flex" aria-label="Primary navigation">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-2 transition-colors duration-160 hover:text-ink-900 after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold-600 after:transition-[width] after:duration-200 ${active ? 'text-ink-900 after:w-full' : 'after:w-0 hover:after:w-full'}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center text-ink-800 transition-colors hover:bg-ivory-100 active:scale-95"
            aria-label="Open bag"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink-900 px-1 text-[9px] font-semibold text-ivory-50">
                {cartCount}
              </span>
            )}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
