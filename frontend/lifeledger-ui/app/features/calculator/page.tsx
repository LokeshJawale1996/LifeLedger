'use client';

import Link from 'next/link';

const calculators = [
  {
    title: 'Simple Calculator',
    description: 'Perform everyday mathematical calculations quickly and easily.',
    icon: '🧮',
    href: '/features/calculator/simple',
    accent: 'from-slate-900 to-slate-700',
  },
  {
    title: 'SIP Calculator',
    description: 'Estimate your SIP investment, returns, and maturity value.',
    icon: '📈',
    href: '/features/calculator/sip',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'PPF Calculator',
    description: 'Estimate your PPF investment, interest, and maturity amount.',
    icon: '💰',
    href: '/features/calculator/ppf',
    accent: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'FD Calculator',
    description: 'Calculate fixed deposit maturity amount and interest earned.',
    icon: '🏦',
    href: '/features/calculator/fd',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    title: 'RD Calculator',
    description: 'Calculate recurring deposit maturity and total interest.',
    icon: '🔄',
    href: '/features/calculator/rd',
    accent: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Home Loan Calculator',
    description: 'Calculate EMI, total interest, total payment, and loan breakdown.',
    icon: '🏠',
    href: '/features/calculator/home-loan',
    accent: 'from-violet-500 to-purple-500',
  },
  {
    title: 'Inflation Calculator',
    description: 'Understand how inflation can affect the value of your money.',
    icon: '📊',
    href: '/features/calculator/inflation',
    accent: 'from-rose-500 to-pink-500',
  },
];

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back to home
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">
                Calculator
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Plan your finances with confidence.
              </h1>

              <p className="mt-3 max-w-2xl text-slate-500">
                Calculate investments, loans, savings, inflation and everyday
                numbers with simple tools designed for LifeLedger.
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-2xl text-white shadow-lg">
              🧮
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calculator) => (
            <Link
              key={calculator.href}
              href={calculator.href}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`h-2 bg-gradient-to-r ${calculator.accent}`}
              />

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${calculator.accent} text-xl text-white shadow-md`}
                  >
                    {calculator.icon}
                  </div>

                  <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700">
                    →
                  </span>
                </div>

                <h2 className="mt-6 text-xl font-bold">
                  {calculator.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {calculator.description}
                </p>

                <div className="mt-5 text-sm font-semibold text-violet-600">
                  Open calculator →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-violet-100 bg-violet-50 p-6">
          <div className="flex gap-4">
            <div className="text-2xl">💡</div>

            <div>
              <h2 className="font-semibold text-slate-900">
                No login required
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                All calculations happen directly in your browser. Your
                calculator inputs are not saved or sent to the LifeLedger
                backend.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}