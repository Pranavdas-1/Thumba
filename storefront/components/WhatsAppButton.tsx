import Link from 'next/link';

// Set NEXT_PUBLIC_WHATSAPP_NUMBER to the preferred international-format number.
// The current brand phone is used until the dedicated WhatsApp number is supplied.
const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918049128800').replace(/\D/g, '');

export function WhatsAppButton() {
  return (
    <Link
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Thumba on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#1f9d61] text-white shadow-[0_10px_30px_rgba(31,157,97,0.28)] transition-transform duration-200 hover:scale-105 hover:bg-[#188451] focus-visible:outline-white sm:bottom-7 sm:right-7 sm:h-14 sm:w-14"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" fill="currentColor">
        <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.55 0 .24 5.3.24 11.84c0 2.09.55 4.13 1.6 5.93L.13 24l6.38-1.67a11.83 11.83 0 0 0 5.57 1.42h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.16-1.23-6.13-3.41-8.43Zm-8.44 18.22h-.01a9.85 9.85 0 0 1-5.02-1.37l-.36-.22-3.79.99 1.01-3.69-.24-.38a9.86 9.86 0 0 1-1.51-5.19C2.16 6.4 6.6 1.96 12.08 1.96c2.66 0 5.16 1.04 7.03 2.91a9.89 9.89 0 0 1 2.92 7.04c0 5.48-4.46 9.93-9.95 9.93Zm5.44-7.44c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      </svg>
    </Link>
  );
}
