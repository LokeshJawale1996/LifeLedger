import Link from 'next/link';

type CalculatorHeaderProps = {
  title: string;
  description: string;
  icon?: string;
};

export default function CalculatorHeader({
  title,
  description,
  icon = '🧮',
}: CalculatorHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        href="/features/calculator"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        ← Back to calculators
      </Link>

      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-600">
            LifeLedger Calculator
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}