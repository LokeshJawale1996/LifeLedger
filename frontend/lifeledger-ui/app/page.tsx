'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAuthSession, getUserDisplayName, type AuthUser } from './lib/auth';

const features = [
  {
    title: "Todo List",
    description: "Plan your tasks, priorities, and personal goals with a clear view.",
    icon: "✅",
    accent: "from-emerald-600 to-teal-500",
    href: "/features/todo",
    releaseNote: "released"
  },
  {
    title: "Password Manager",
    description: "Keep your logins and private notes organized in one secure place.",
    icon: "🔐",
    accent: "from-slate-900 to-slate-700",
    href: "/features/password-manager",
    releaseNote: "released"

  },
  {
    title: "Borrowed / Lent",
    description: "Track who owes what so money conversations stay simple and transparent.",
    icon: "💸",
    accent: "from-rose-500 to-pink-500",
    href: "/features/borrowed-lent",
    releaseNote: "coming soon"
  },
  {
    title: "Savings Tracker",
    description: "See where your money is invested and how your savings are growing.",
    icon: "📈",
    accent: "from-cyan-600 to-sky-500",
    href: "/features/savings-tracker",
    releaseNote: "coming soon"
  },
  {
    title: "Calculator",
    description: "Quickly calculate expenses, budgets, and everyday numbers on the go.",
    icon: "🧮",
    accent: "from-violet-600 to-indigo-500",
    href: "/features/calculator",
    releaseNote: "coming soon"
  },
  {
    title: "Family Friends Details",
    description: "Store important family information, contacts, and life updates in one place.",
    icon: "👨‍👩‍👧‍👦",
    accent: "from-fuchsia-600 to-purple-500",
    href: "/features/family-friends-details",
    releaseNote: "coming soon"
  },
];

export default function Home() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getAuthSession()?.user || null);
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <main className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.35)] backdrop-blur md:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                Personal life management, simplified
              </div>
              {user ? (
                <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  Welcome back, {getUserDisplayName(user)}
                </div>
              ) : null}
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Keep every part of your life in one calm, organized space.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  LifeLedger helps you handle passwords, daily tasks, groceries, money,
                  savings, and family details without switching between apps.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#features"
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Explore modules
                </a>
                <a
                  href="#overview"
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  See overview
                </a>
              </div>
            </div>

            <div className="rounded-[24px] bg-slate-950 p-6 text-white shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                At a glance
              </p>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Active plans</p>
                  <p className="mt-1 text-2xl font-semibold">{features.length} focused modules</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Daily control</p>
                  <p className="mt-1 text-2xl font-semibold">Tasks, money, and family all connected</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Goal</p>
                  <p className="mt-1 text-2xl font-semibold">Make life feel lighter</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="overview" className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Built for daily life</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Everything you need in one dashboard</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Easy to follow</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Simple sections for errands, money, and memory</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Made to grow</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Add more routines as your life evolves</p>
          </div>
        </section>

        <section id="about" className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Why it matters</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Built to support the way real life works</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            LifeLedger brings your essentials together so you can stay on top of everyday commitments,
            personal responsibilities, and important relationships without extra stress.
          </p>
        </section>

        <section id="features" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const isComingSoon = feature.releaseNote?.toLowerCase() === 'coming soon';

            const content = (
              <>
                <div className={`inline-flex rounded-2xl bg-gradient-to-br ${feature.accent} px-3 py-2 text-2xl`}>
                  {feature.icon}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-slate-900">{feature.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{feature.description}</p>
                {isComingSoon ? (
                  <span className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                    Coming soon
                  </span>
                ) : null}
              </>
            );

            if (feature.href && !isComingSoon) {
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="block rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {content}
                </Link>
              );
            }

            return (
              <article
                key={feature.title}
                className={`rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${isComingSoon ? 'cursor-not-allowed opacity-80' : ''}`}
                aria-disabled={isComingSoon ? 'true' : undefined}
              >
                {content}
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
