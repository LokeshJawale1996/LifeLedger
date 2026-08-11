'use client';

import { useMemo, useState } from 'react';
import CalculatorHeader from '../components/CalculatorHeader';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function InflationCalculatorPage() {
  const [amount, setAmount] = useState(1000000);
  const [inflationRate, setInflationRate] = useState(6);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const futureValue =
      amount * Math.pow(1 + inflationRate / 100, years);

    const purchasingPower =
      amount / Math.pow(1 + inflationRate / 100, years);

    return {
      futureValue,
      purchasingPower,
      increase: futureValue - amount,
    };
  }, [amount, inflationRate, years]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <CalculatorHeader
          title="Inflation Calculator"
          description="Understand how inflation can affect the future cost and purchasing power of your money."
          icon="📊"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Inflation Details</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Current Amount
                </label>

                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Inflation Rate (%)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) =>
                    setInflationRate(Number(e.target.value))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Number of Years
                </label>

                <input
                  type="number"
                  min="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg">
            <p className="text-sm text-slate-400">
              Estimated Future Cost
            </p>

            <p className="mt-2 text-4xl font-bold">
              {formatCurrency(result.futureValue)}
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <p className="text-sm text-slate-400">
                  Additional Cost
                </p>

                <p className="mt-1 text-xl font-semibold text-rose-300">
                  {formatCurrency(result.increase)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Purchasing Power of Today's Amount
                </p>

                <p className="mt-1 text-xl font-semibold text-emerald-400">
                  {formatCurrency(result.purchasingPower)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            What does this mean?
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            If inflation remains around {inflationRate}% for {years} years,
            something that costs {formatCurrency(amount)} today could cost
            approximately {formatCurrency(result.futureValue)} in the future.
          </p>
        </div>
      </div>
    </div>
  );
}