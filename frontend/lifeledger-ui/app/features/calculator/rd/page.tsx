'use client';

import { useMemo, useState } from 'react';
import CalculatorHeader from '../components/CalculatorHeader';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function RdCalculatorPage() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const months = years * 12;
    const quarterlyRate = rate / 400;

    let maturity = 0;

    for (let month = 1; month <= months; month++) {
      maturity += monthlyDeposit;

      maturity *= Math.pow(1 + quarterlyRate, 1 / 3);
    }

    const invested = monthlyDeposit * months;

    return {
      invested,
      interest: maturity - invested,
      maturity,
    };
  }, [monthlyDeposit, rate, years]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <CalculatorHeader
          title="RD Calculator"
          description="Estimate your recurring deposit investment, interest, and maturity value."
          icon="🔄"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">RD Details</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Monthly Deposit
                </label>

                <input
                  type="number"
                  min="0"
                  value={monthlyDeposit}
                  onChange={(e) =>
                    setMonthlyDeposit(Number(e.target.value))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Tenure (Years)
                </label>

                <input
                  type="number"
                  min="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg">
            <p className="text-sm text-slate-400">Maturity Amount</p>

            <p className="mt-2 text-4xl font-bold">
              {formatCurrency(result.maturity)}
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <p className="text-sm text-slate-400">Total Deposited</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatCurrency(result.invested)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Interest Earned</p>
                <p className="mt-1 text-xl font-semibold text-emerald-400">
                  {formatCurrency(result.interest)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}