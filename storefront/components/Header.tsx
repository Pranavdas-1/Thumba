'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart } from 'lucide-react';
import { BRAND } from '@thumba/shared';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { SearchOverlay } from './SearchOverlay';
import { MobileNav } from './MobileNav';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/shop', label: 'Shop All' },
    { href: '/collections', label: 'Collections' },
    { href: '/shop?sort=newest', label: 'New Arrivals' },
    { href: '/#craft', label: 'The Craft' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-[background-color,box-shadow] duration-250 ease-out-cubic ${scrolled ? 'border-ivory-200 bg-ivory-50/95 shadow-[0_10px_30px_rgba(28,27,25,0.06)] backdrop-blur-md' : 'border-ivory-200/70 bg-ivory-50/90 backdrop-blur-sm'}`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 py-4 sm:px-6 lg:px-8">
        {/* Left: Mobile menu toggle + Desktop navigation */}
        <div className="flex items-center gap-5">
          <MobileNav />
          <nav className="hidden items-center gap-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-600 md:flex">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === '/shop' && pathname.startsWith('/shop'));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-2 transition-colors duration-160 hover:text-ink-900 after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold-600 after:transition-transform after:duration-160 after:content-[''] ${isActive ? 'text-ink-900 after:w-full' : 'after:w-0 hover:after:w-full'}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center: Brand Logo */}
        <div className="text-center">
          <Link
            href="/"
            className="group inline-block outline-none"
            aria-label="Thumba home"
          >
            <span className="font-serif text-2xl font-semibold tracking-[0.14em] text-ink-900 transition-colors group-hover:text-gold-800 md:text-3xl">
              {BRAND.name}
            </span>
            <span className="mt-0.5 block text-[8px] uppercase tracking-[0.32em] text-ink-500">
              Fine jewelry atelier
            </span>
          </Link>
        </div>

        {/* Right: Search, Wishlist, Cart */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-3">
          <SearchOverlay />

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center text-ink-700 transition-colors hover:bg-ivory-100 hover:text-brand-600 active:scale-95"
            aria-label="View wishlist"
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-700 px-1 text-[9px] font-semibold text-ivory-50">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link */}
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
        </div>
      </div>
    </header>
  );
}
