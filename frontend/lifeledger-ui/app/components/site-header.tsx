'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearAuthSession, getAuthSession, type AuthUser } from '../lib/auth';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Overview', href: '/#overview' },
  { label: 'Features', href: '/#features' },
  { label: 'About', href: '/#about' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getAuthSession()?.user || null);
  }, [pathname]);

  useEffect(() => {
    const handleStorage = () => setUser(getAuthSession()?.user || null);
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href.split('#')[0];
  };

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    setProfileOpen(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white">
            L
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-950">LifeLedger</p>
            <p className="text-xs text-slate-500">Your life, in balance</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-sm font-medium transition ${
                isActive(item.href)
                  ? 'text-slate-950'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {user ? (
          <div className="relative hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white"
              aria-label="Open profile menu"
            >
              {user.fullName?.[0] || user.firstName?.[0] || user.email?.[0] || 'U'}
            </button>
            <div className="text-sm text-slate-700">
              <p className="font-semibold">{user.fullName || (user.firstName ? `${user.firstName} ${user.lastName ?? ''}` : user.email)}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            {profileOpen ? (
              <div className="absolute right-0 top-full mt-3 w-52 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Sign up
            </Link>
          </div>
        )}

        <button
          type="button"
          aria-label="Toggle navigation"
          className="rounded-full border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-50 md:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-medium ${
                  isActive(item.href)
                    ? 'bg-slate-100 text-slate-950'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{user.email}</p>
                <button
                  type="button"
                  onClick={() => {
                    clearAuthSession();
                    setUser(null);
                    setMobileMenuOpen(false);
                    router.push('/login');
                  }}
                  className="mt-3 w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-slate-950 px-4 py-2 text-center text-sm font-semibold text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
