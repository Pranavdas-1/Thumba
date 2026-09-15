'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@thumba/shared';
import { useWishlistStore } from '@/lib/wishlist-store';

type WishlistButtonProps = {
  product: Product;
  className?: string;
  size?: 'sm' | 'md';
};

export function WishlistButton({
  product,
  className = '',
  size = 'md',
}: WishlistButtonProps) {
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id),
  );
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const [isAnimating, setIsAnimating] = useState(false);

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    const added = toggleItem(product);
    setTimeout(() => setIsAnimating(false), 260);

    if (added) {
      toast.success(`${product.name} saved to wishlist`);
    } else {
      toast.info(`${product.name} removed from wishlist`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`group flex items-center justify-center border border-ink-900/15 bg-ivory-50/90 p-2.5 text-ink-700 backdrop-blur-md transition-[background-color,color,transform] duration-160 ease-out-cubic hover:bg-white hover:text-brand-700 active:scale-95 ${className}`}
    >
      <Heart
        className={`${iconSize} transition-transform duration-200 ease-out-cubic ${
          isInWishlist
            ? 'fill-brand-600 text-brand-600'
            : 'text-ink-700 group-hover:text-brand-600'
        } ${isAnimating ? 'scale-125' : 'scale-100'}`}
      />
    </button>
  );
}
