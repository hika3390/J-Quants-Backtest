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
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700 nav-bar">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between h-12">
          <div className="flex items-center">
            <Link 
              href={session ? "/" : "/auth/signin"}
              className="text-lg font-semibold text-gray-100"
            >
              Backtest
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {navLinks.map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`
                  px-3 py-2 flex items-center text-sm
                  transition-base
                  ${isActive(href)
                    ? 'bg-gray-800 text-gray-100 font-medium'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
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
