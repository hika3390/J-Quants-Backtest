'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

type NavLink = {
  href: string;
  icon: string;
  label: string;
};

const authenticatedLinks: NavLink[] = [
  { href: '/', icon: '🚀', label: 'ホーム' },
  { href: '/results', icon: '📊', label: 'バックテスト結果' },
  { href: '/settings', icon: '⚙️', label: '設定' }
];

const publicLinks: NavLink[] = [
  { href: '/auth/signin', icon: '🔑', label: 'ログイン' },
  { href: '/auth/signup', icon: '✨', label: '新規登録' }
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const navLinks = session ? authenticatedLinks : publicLinks;

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link 
              href={session ? "/" : "/auth/signin"}
              className="text-xl font-bold text-slate-200 hover:text-white transition-colors"
            >
              Backtest
            </Link>
          </div>
          <div className="flex items-center space-x-1">
            {navLinks.map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`
                  px-3 h-8 flex items-center rounded-md text-sm font-medium
                  transition-colors
                  ${isActive(href)
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <span>{icon}</span>
                  <span>{label}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
