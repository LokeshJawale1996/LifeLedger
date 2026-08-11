'use client';

import { useMemo, useState } from 'react';
import CalculatorHeader from '../components/CalculatorHeader';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function FdCalculatorPage() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const maturity =
      principal * Math.pow(1 + rate / 100 / 4, 4 * years);

    return {
      maturity,
      interest: maturity - principal,
    };
  }, [principal, rate, years]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <CalculatorHeader
          title="FD Calculator"
          description="Calculate your fixed deposit maturity amount and estimated interest."
          icon="🏦"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Deposit Details</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Deposit Amount
                </label>

                <input
                  type="number"
                  min="0"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Interest Rate (%)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Tenure (Years)
                </label>

                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg">
            <p className="text-sm text-slate-400">Maturity Amount</p>

            <p className="mt-2 text-4xl font-bold">
              {formatCurrency(result.maturity)}
            </p>

            <div className="mt-8">
              <p className="text-sm text-slate-400">Interest Earned</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-400">
                {formatCurrency(result.interest)}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm text-slate-400">Principal</p>
              <p className="mt-1 text-xl font-semibold">
                {formatCurrency(principal)}
              </p>
            </div>

            <p className="mt-8 text-xs leading-5 text-slate-400">
              Calculation uses quarterly compounding for estimation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}