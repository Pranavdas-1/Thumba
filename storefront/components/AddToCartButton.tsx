'use client';

import { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@thumba/shared';
import { useCartStore } from '@/lib/cart-store';

type AddToCartButtonProps = {
  product: Product;
  variantName?: string;
  quantity?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function AddToCartButton({
  product,
  variantName,
  quantity = 1,
  className = '',
  size = 'md',
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const sizeClasses = {
    sm: 'px-5 py-2 text-xs',
    md: 'px-7 py-3 text-sm',
    lg: 'px-9 py-4 text-base',
  }[size];

  const handleAdd = () => {
    if (!product.inStock) return;
    addItem(product, quantity, variantName);
    setAdded(true);
    toast.success(
      `Added ${product.name}${variantName ? ` (${variantName})` : ''} to your bag`,
    );
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <button
      type="button"
      disabled={!product.inStock}
      onClick={handleAdd}
      className={`group flex items-center justify-center gap-2 border border-ink-900 font-medium transition-[background-color,color,transform] duration-160 ease-out-cubic active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 ${
        added
          ? 'bg-gold-700 text-ivory-50'
          : 'bg-ink-900 text-ivory-50 hover:bg-ink-800 hover:shadow-md'
      } ${sizeClasses} ${className}`}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" />
          <span>Added to Bag</span>
        </>
      ) : product.inStock ? (
        <>
          <ShoppingBag className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          <span>Add to Bag</span>
        </>
      ) : (
        <span>Out of Stock</span>
      )}
    </button>
  );
}
