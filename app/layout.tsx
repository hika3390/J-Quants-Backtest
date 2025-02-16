import Navbar from '@/components/Navbar';
import React from 'react';
import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'バックテストシステム',
  description: 'バックテストシステムの説明',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased bg-gradient-to-br from-gray-900 to-black text-gray-100 min-h-screen overflow-x-hidden hardware-accelerated">
        <Providers>
          <div className="min-h-screen backdrop-blur-sm hardware-accelerated">
            <Navbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
