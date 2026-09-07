import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ivory-200 bg-ivory-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-ink-700 md:flex-row md:items-center md:justify-between">
        <p className="font-serif text-lg text-ink-900">Thumba</p>
        <p>Handmade jewelry, packed with care. Test payments via Razorpay test mode.</p>
        <div className="flex gap-6">
          <Link href="/shop">Shop</Link>
          <Link href="/collections">Collections</Link>
        </div>
      </div>
    </footer>
  );
}
