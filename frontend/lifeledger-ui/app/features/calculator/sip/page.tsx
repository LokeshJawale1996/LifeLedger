'use client';

import { useMemo, useState } from 'react';
import CalculatorHeader from '../components/CalculatorHeader';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function SipCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const months = years * 12;
    const monthlyRate = annualReturn / 12 / 100;

    const maturity =
      monthlyRate === 0
        ? monthlyInvestment * months
        : monthlyInvestment *
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate));

    const invested = monthlyInvestment * months;

    return {
      invested,
      returns: maturity - invested,
      maturity,
    };
  }, [monthlyInvestment, annualReturn, years]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <CalculatorHeader
          title="SIP Calculator"
          description="Estimate your SIP investment, expected returns, and maturity value."
          icon="📈"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Investment Details</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Monthly Investment
                </label>

                <input
                  type="number"
                  min="0"
                  value={monthlyInvestment}
                  onChange={(e) =>
                    setMonthlyInvestment(Number(e.target.value))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Expected Annual Return (%)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Investment Period (Years)
                </label>

                <input
                  type="number"
                  min="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg">
            <p className="text-sm text-slate-400">Estimated Maturity Value</p>

            <p className="mt-2 text-4xl font-bold">
              {formatCurrency(result.maturity)}
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-400">Total Investment</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatCurrency(result.invested)}
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-500/20 p-4">
                <p className="text-sm text-emerald-300">
                  Estimated Returns
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {formatCurrency(result.returns)}
                </p>
              </div>
            </div>

            <p className="mt-6 text-xs leading-5 text-slate-400">
              This is an estimate based on the assumed annual return and
              monthly compounding. Actual investment returns may vary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}