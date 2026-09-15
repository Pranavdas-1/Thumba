import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { editorialImages } from '@/lib/image-library';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Thumba — Fine Jewelry, Quiet Luxury',
    template: '%s | Thumba Fine Jewelry',
  },
  description:
    'Fine jewelry in gold, silver, pearls, and stones. Sculptural pieces with a quiet point of view.',
  keywords: [
    'fine jewelry',
    'gold jewelry',
    'pearl necklace',
    'artisan jewelry',
    'gold jewelry',
    'quiet luxury',
  ],
  openGraph: {
    title: 'Thumba — Fine Jewelry, Quiet Luxury',
    description: 'Modern heirlooms in gold, pearl, and silver.',
    url: 'https://thumba.in',
    siteName: 'Thumba',
    images: [
      {
        url: editorialImages.hero,
        width: 1200,
        height: 630,
        alt: 'Thumba Fine Jewelry Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-ivory-50 text-ink-900">
        <Header />
        {children}
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#fdfbf7',
              color: '#171412',
              border: '1px solid #ece4d6',
              borderRadius: '1rem',
              fontSize: '0.875rem',
              boxShadow: '0 10px 25px -5px rgba(23, 20, 18, 0.1)',
            },
          }}
        />
      </body>
    </html>
  );
}
