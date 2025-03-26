'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

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
  return (
    <main>
      {/* 軽量化したグラデーション背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from)_0%,_transparent_35%)] from-indigo-500/20" />
      
      <div className="relative">
        <div className="p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* 戻るリンク */}
            {backLink && (
              <div>
                <Link
                  href={backLink.href}
                  className="inline-flex items-center text-slate-400 hover:text-white gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                  <span>←</span>
                  <span>{backLink.label}</span>
                </Link>
              </div>
            )}

            {/* タイトルセクション */}
            <div className="text-center">
              <div className="mb-4">
                {typeof title === 'string' ? (
                  <h1 className="text-4xl font-bold">
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:200%_auto] animate-[gradientShift_3s_ease-in-out_infinite] bg-clip-text text-transparent">
                      {title}
                    </span>
                  </h1>
                ) : (
                  title
                )}
              </div>
              {subtitle && (
                <p className="text-lg text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>

            {/* メインコンテンツ */}
            <div className="relative">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
