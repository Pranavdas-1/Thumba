import Link from 'next/link';
import { X } from 'lucide-react';

type FilterChipProps = {
  href: string;
  active: boolean;
  label: string;
  onRemove?: () => void;
};

export function FilterChip({ href, active, label, onRemove }: FilterChipProps) {
  if (onRemove) {
    return (
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex items-center gap-1.5 border border-ink-900 bg-ink-900 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-ivory-50 transition-[background-color,transform] hover:bg-ink-800 active:scale-95"
      >
        <span>{label}</span>
        <X className="h-3 w-3" />
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={`border-b px-0.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-[border-color,color,transform] duration-160 active:scale-95 ${
        active
          ? 'border-ink-900 text-ink-900'
          : 'border-transparent text-ink-500 hover:border-gold-600 hover:text-ink-900'
      }`}
    >
      {label}
    </Link>
  );
}
