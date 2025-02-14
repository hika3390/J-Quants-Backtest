'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PageLayoutProps {
  children: ReactNode;
  title: string | React.ReactNode;
  subtitle?: string;
  backLink?: {
    href: string;
    label: string;
  };
}

export function PageLayout({ children, title, subtitle, backLink }: PageLayoutProps) {
  const pathname = usePathname();

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 戻るリンク */}
          {backLink && (
            <div>
              <Link
                href={backLink.href}
                className="inline-flex items-center text-white/60 hover:text-white transition-colors gap-2 px-4 py-2 rounded-lg hover:bg-white/5"
              >
                <span className="text-lg">←</span>
                <span>{backLink.label}</span>
              </Link>
            </div>
          )}

          {/* タイトルセクション */}
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tight text-white/90 mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-white/60">
                {subtitle}
              </p>
            )}
          </div>

          {/* メインコンテンツ */}
          <div>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
