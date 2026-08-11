'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiPost, saveAuthSession, type AuthUser } from '../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const data = await apiPost<{
        token?: string;
        user?: any;
        fullName?: string;
        username?: string;
        gender?: string;
        userId?: number;
      }>('/api/auth/login', {
        username: form.username,
        password: form.password,
      });

      const user = data?.user || {
        id: data?.userId,
        userId: data?.userId,
        email: data?.username || form.username,
        fullName: data?.fullName,
        gender: data?.gender,
      };

      saveAuthSession({ token: data?.token, user });
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Login to LifeLedger</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Access your personal dashboard, tasks, and financial tools securely.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="username">
              Email
            </label>
            <input
              id="username"
              name="username"
              type="email"
              required
              value={form.username}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
            />
          </div>

          {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          New here?{' '}
          <Link href="/signup" className="font-semibold text-slate-950">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
