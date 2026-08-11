'use client';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8 text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-slate-900">LifeLedger</p>
          <p className="text-sm text-slate-500">Manage your tasks, money, family, and life routines in one place.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-sm">Built for personal life management.</p>
          <p className="text-sm">© {new Date().getFullYear()} LifeLedger</p>
        </div>
      </div>
    </footer>
  );
}
