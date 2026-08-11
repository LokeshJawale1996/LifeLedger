'use client';

import { useMemo, useState } from 'react';
import CalculatorHeader from '../components/CalculatorHeader';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function HomeLoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(4250000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(30);
  const [extraMonthly, setExtraMonthly] = useState(0);

  const result = useMemo(() => {
    const months = years * 12;
    const monthlyRate = rate / 12 / 100;

    const emi =
      monthlyRate === 0
        ? loanAmount / months
        : (loanAmount *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanAmount;

    const paymentWithExtra = emi + extraMonthly;

    let balance = loanAmount;
    let monthsWithExtra = 0;
    let interestWithExtra = 0;

    while (balance > 0 && monthsWithExtra < months * 2) {
      const interest = balance * monthlyRate;

      interestWithExtra += interest;

      const principalPayment = Math.min(
        paymentWithExtra - interest,
        balance
      );

      balance -= principalPayment;
      monthsWithExtra++;
    }

    const interestSaved =
      extraMonthly > 0
        ? totalInterest - interestWithExtra
        : 0;

    return {
      emi,
      totalPayment,
      totalInterest,
      months,
      monthsWithExtra,
      interestWithExtra,
      interestSaved,
    };
  }, [loanAmount, rate, years, extraMonthly]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <CalculatorHeader
          title="Home Loan Calculator"
          description="Calculate EMI, total interest, total payment and understand the impact of extra payments."
          icon="🏠"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Loan Details</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Loan Amount
                </label>

                <input
                  type="number"
                  min="0"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Loan Tenure (Years)
                </label>

                <input
                  type="number"
                  min="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div className="border-t border-slate-100 pt-5">
                <label className="mb-2 block text-sm font-semibold">
                  Extra Monthly Payment
                  <span className="ml-1 font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <input
                  type="number"
                  min="0"
                  value={extraMonthly}
                  onChange={(e) => setExtraMonthly(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg">
            <p className="text-sm text-slate-400">Monthly EMI</p>

            <p className="mt-2 text-4xl font-bold">
              {formatCurrency(result.emi)}
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-400">
                  Principal
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {formatCurrency(loanAmount)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-400">
                  Total Interest
                </p>

                <p className="mt-1 text-xl font-semibold text-orange-300">
                  {formatCurrency(result.totalInterest)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-400">
                  Total Payment
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {formatCurrency(result.totalPayment)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {extraMonthly > 0 && (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
            <h2 className="text-xl font-bold text-emerald-900">
              Extra Payment Impact
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm text-slate-500">
                  Original Tenure
                </p>

                <p className="mt-1 font-bold">
                  {result.months} months
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm text-slate-500">
                  New Estimated Tenure
                </p>

                <p className="mt-1 font-bold">
                  {result.monthsWithExtra} months
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm text-slate-500">
                  Estimated Interest Saved
                </p>

                <p className="mt-1 font-bold text-emerald-600">
                  {formatCurrency(Math.max(0, result.interestSaved))}
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="mt-5 text-xs leading-5 text-slate-400">
          Results are estimates. Actual EMI and loan amortization may vary
          based on lender-specific terms, interest-rate changes, fees and
          payment timing.
        </p>
      </div>
    </div>
  );
}