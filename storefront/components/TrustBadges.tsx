import { BadgeCheck, Gem, ShieldCheck, Truck } from 'lucide-react';

const trustItems = [
  { label: 'Authenticity certificate', icon: BadgeCheck },
  { label: 'Secure payments', icon: ShieldCheck },
  { label: 'India-wide delivery', icon: Truck },
  { label: 'Hallmarked materials', icon: Gem },
];

export function TrustBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {trustItems.map(({ label, icon: Icon }) => (
        <div key={label} className="flex items-center gap-2 border border-ivory-200 bg-ivory-50/60 px-3 py-3 text-[10px] uppercase tracking-[0.08em] text-ink-600">
          <Icon className="h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
