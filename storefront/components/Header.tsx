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
  const isHome = pathname === '/';
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
      className={`${isHome ? 'absolute inset-x-0 top-0' : 'sticky top-0'} z-40 w-full border-b transition-[background-color,box-shadow] duration-250 ease-out-cubic ${isHome ? (scrolled ? 'border-ivory-50/20 bg-ink-900/35 backdrop-blur-md' : 'border-transparent bg-transparent') : (scrolled ? 'border-ivory-200 bg-ivory-50/95 shadow-[0_10px_30px_rgba(33,30,26,0.06)] backdrop-blur-md' : 'border-ivory-200/70 bg-ivory-50/90 backdrop-blur-sm')}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-1 px-4 py-3.5 sm:gap-5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Link href="/" className="group shrink-0 outline-none" aria-label="Thumba home">
            <span className={`font-serif text-2xl font-semibold tracking-[0.14em] transition-colors sm:text-3xl ${isHome ? 'text-ivory-50 group-hover:text-gold-200' : 'text-ink-900 group-hover:text-gold-700'}`}>
              {BRAND.name}
            </span>
            <span className={`mt-0.5 hidden text-[8px] uppercase tracking-[0.32em] sm:block ${isHome ? 'text-ivory-300' : 'text-ink-500'}`}>
              Fine jewelry collection
            </span>
          </Link>

          <nav className={`hidden items-center gap-7 text-[10px] font-semibold uppercase tracking-[0.18em] md:flex ${isHome ? 'text-ivory-200' : 'text-ink-600'}`} aria-label="Primary navigation">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-2 transition-colors duration-160 after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold-300 after:transition-[width] after:duration-200 ${isHome ? 'hover:text-white' : 'hover:text-ink-900'} ${active ? (isHome ? 'text-white after:w-full' : 'text-ink-900 after:w-full') : 'after:w-0 hover:after:w-full'}`}
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
            className={`relative flex h-10 w-10 items-center justify-center transition-colors active:scale-95 ${isHome ? 'text-ivory-50 hover:bg-white/10' : 'text-ink-800 hover:bg-ivory-100'}`}
            aria-label="Open bag"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink-900 px-1 text-[9px] font-semibold text-ivory-50">
                {cartCount}
              </span>
            )}
          </Link>
          <MobileNav overlay={isHome} />
        </div>
      </div>
    </header>
  );
}
