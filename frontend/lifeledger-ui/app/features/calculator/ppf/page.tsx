'use client';

import { useMemo, useState } from 'react';
import CalculatorHeader from '../components/CalculatorHeader';

const PPF_INTEREST_RATE = 7.1;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function PpfCalculatorPage() {
  const [annualInvestment, setAnnualInvestment] = useState(150000);
  const [years, setYears] = useState(15);

  const result = useMemo(() => {
    const rate = PPF_INTEREST_RATE / 100;

    let balance = 0;
    let totalInvestment = 0;

    const yearlyData = [];

    for (let year = 1; year <= years; year++) {
      balance += annualInvestment;
      totalInvestment += annualInvestment;

      const interest = balance * rate;
      balance += interest;

      yearlyData.push({
        year,
        investment: totalInvestment,
        interest,
        balance,
      });
    }

    return {
      totalInvestment,
      interest: balance - totalInvestment,
      maturity: balance,
      yearlyData,
    };
  }, [annualInvestment, years]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <CalculatorHeader
          title="PPF Calculator"
          description="Estimate your PPF investment, interest earned, and maturity amount."
          icon="💰"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">PPF Details</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Annual Investment
                </label>

                <input
                  type="number"
                  min="0"
                  max="150000"
                  value={annualInvestment}
                  onChange={(e) =>
                    setAnnualInvestment(Number(e.target.value))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Maximum shown here: ₹1,50,000 per year.
                </p>
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-sm text-blue-700">Configured Interest Rate</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">
                  {PPF_INTEREST_RATE}%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg">
            <p className="text-sm text-slate-400">Estimated Maturity</p>

            <p className="mt-2 text-4xl font-bold">
              {formatCurrency(result.maturity)}
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <p className="text-sm text-slate-400">Total Investment</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatCurrency(result.totalInvestment)}
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

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Year-wise Projection</h2>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3">Year</th>
                  <th className="px-3 py-3">Investment</th>
                  <th className="px-3 py-3">Interest</th>
                  <th className="px-3 py-3">Balance</th>
                </tr>
              </thead>

              <tbody>
                {result.yearlyData.map((item) => (
                  <tr
                    key={item.year}
                    className="border-b border-slate-100"
                  >
                    <td className="px-3 py-3">{item.year}</td>
                    <td className="px-3 py-3">
                      {formatCurrency(item.investment)}
                    </td>
                    <td className="px-3 py-3 text-emerald-600">
                      {formatCurrency(item.interest)}
                    </td>
                    <td className="px-3 py-3 font-semibold">
                      {formatCurrency(item.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400">
            This calculator uses the configured fixed rate and a simplified
            annual contribution model for estimation. Actual PPF interest
            calculation depends on contribution timing and applicable rules.
          </p>
        </div>
      </div>
    </div>
  );
}