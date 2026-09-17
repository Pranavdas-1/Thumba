import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Thumba Admin Dashboard',
    template: '%s | Thumba Admin',
  },
  description: 'Manage products and orders for Thumba.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 p-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
