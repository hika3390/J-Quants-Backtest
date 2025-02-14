"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLink = {
  href: string;
  icon: string;
  label: string;
};

const navLinks: NavLink[] = [
  { href: '/', icon: '🚀', label: 'ホーム' },
  { href: '/results', icon: '📊', label: 'バックテスト結果' },
  { href: '/settings', icon: '⚙️', label: '設定' }
];

const styles = {
  nav: "relative backdrop-blur-sm bg-black/10 border-b border-white/10",
  container: "container mx-auto px-4 py-3",
  wrapper: "flex justify-between items-center",
  logo: "text-2xl font-black tracking-tight",
  logoText: "bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400",
  linkContainer: "flex items-center space-x-1",
  link: (isActive: boolean) => `
    px-4 py-2 rounded-lg font-medium 
    transition-all duration-200 ease-in-out
    transform hover:scale-105
    ${isActive 
      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
      : 'text-gray-300 hover:text-white hover:bg-white/5'
    }
  `,
  icon: "transform hover:scale-110 transition-transform",
  gradientLine: "absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
};

const NavLink = ({ href, icon, label }: NavLink) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={styles.link(isActive)}>
      <span className="flex items-center space-x-2">
        <span className={styles.icon}>{icon}</span>
        <span>{label}</span>
      </span>
    </Link>
  );
};

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>
              Backtest
            </span>
          </Link>
          <div className={styles.linkContainer}>
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.gradientLine} />
    </nav>
  );
}
