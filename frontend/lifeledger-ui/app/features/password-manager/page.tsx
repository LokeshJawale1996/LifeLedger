'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { getAuthSession } from '../../lib/auth';

type PasswordItem = {
  id: number;
  appName: string;
  webAddress: string;
  loginUserId: string;
  password: string;
  note: string;
};

type ApiPasswordItem = {
  id: number;
  userId: number;
  appName: string;
  webAddress?: string;
  loginUserId: string;
  password: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
};

function mapApiPasswordItem(item: ApiPasswordItem): PasswordItem {
  return {
    id: item.id,
    appName: item.appName,
    webAddress: item.webAddress ?? '',
    loginUserId: item.loginUserId,
    password: item.password,
    note: item.note ?? '',
  };
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const raw = await response.text();

  if (!raw) {
    throw new Error(response.statusText || 'Unexpected empty response');
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(raw);
  }
}

export default function PasswordManagerPage() {
  const [items, setItems] = useState<PasswordItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');

  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] =
    useState<PasswordItem | null>(null);

  const [appName, setAppName] = useState('');
  const [webAddress, setWebAddress] = useState('');
  const [loginUserId, setLoginUserId] = useState('');
  const [password, setPassword] = useState('');
  const [note, setNote] = useState('');

  const [ownerId, setOwnerId] = useState<number | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  useEffect(() => {
    const session = getAuthSession();

    const id =
      session?.user?.id ??
      session?.user?.userId;

    if (id === undefined || id === null) {
      setOwnerId(null);
      setItems([]);
      setLoading(false);
      return;
    }

    const numericUserId = Number(id);

    if (Number.isNaN(numericUserId)) {
      setOwnerId(null);
      setItems([]);
      setLoading(false);
      return;
    }

    setOwnerId(numericUserId);

    loadCredentials(numericUserId);
  }, []);

  // ============================================================
  // LOAD CREDENTIALS
  // ============================================================

  const loadCredentials = async (userId: number) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/password-manager/getByUserId/${userId}`
      );

      if (!response.ok) {
        const errorBody =
          await parseJsonResponse<{ error?: string }>(
            response
          );

        throw new Error(
          errorBody?.error ||
          'Unable to load credentials'
        );
      }

      const data =
        await parseJsonResponse<ApiPasswordItem[]>(
          response
        );

      setItems(data.map(mapApiPasswordItem));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load credentials'
      );

      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // OPEN ADD FORM
  // ============================================================

  const openAddForm = () => {
    if (!ownerId) {
      return;
    }

    setEditingItem(null);

    setAppName('');
    setWebAddress('');
    setLoginUserId('');
    setPassword('');
    setNote('');

    setShowPassword(false);

    setShowForm(true);

    setError('');
  };

  // ============================================================
  // OPEN EDIT FORM
  // ============================================================

  const openEditForm = (item: PasswordItem) => {
    if (!ownerId) {
      return;
    }

    setEditingItem(item);

    setAppName(item.appName);
    setWebAddress(item.webAddress);
    setLoginUserId(item.loginUserId);
    setPassword(item.password);
    setNote(item.note);

    setShowPassword(false);

    setShowForm(true);

    setError('');
  };

  // ============================================================
  // CLOSE FORM
  // ============================================================

  const closeForm = () => {
    setShowForm(false);

    setEditingItem(null);

    setAppName('');
    setWebAddress('');
    setLoginUserId('');
    setPassword('');
    setNote('');

    setShowPassword(false);

    setError('');
  };

  // ============================================================
  // GENERATE PASSWORD
  // ============================================================

  const generatePassword = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

    let generated = '';

    for (let i = 0; i < 16; i += 1) {
      generated += characters.charAt(
        Math.floor(
          Math.random() * characters.length
        )
      );
    }

    setPassword(generated);

    setShowPassword(true);
  };

  // ============================================================
  // SAVE / UPDATE
  // ============================================================

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (
      !ownerId ||
      !appName.trim() ||
      !loginUserId.trim() ||
      !password.trim()
    ) {
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      appName: appName.trim(),
      webAddress: webAddress.trim(),
      loginUserId: loginUserId.trim(),
      password,
      note: note.trim(),
    };

    try {
      // ========================================================
      // UPDATE
      // ========================================================

      if (editingItem) {
        const response = await fetch(
          `/api/password-manager/updateById/${editingItem.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorBody =
            await parseJsonResponse<{
              error?: string;
            }>(response);

          throw new Error(
            errorBody?.error ||
            'Unable to update credential'
          );
        }
      }

      // ========================================================
      // CREATE
      // ========================================================

      else {
        const response = await fetch(
          `/api/password-manager/create?userId=${encodeURIComponent(
            String(ownerId)
          )}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorBody =
            await parseJsonResponse<{
              error?: string;
            }>(response);

          throw new Error(
            errorBody?.error ||
            'Unable to create credential'
          );
        }
      }

      await loadCredentials(ownerId);

      closeForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save credential'
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const deleteItem = async (id: number) => {
    setError('');

    try {
      const confirmed = window.confirm(
        'Are you sure you want to delete this credential?'
      );

      if (!confirmed) {
        return;
      }

      const response = await fetch(
        `/api/password-manager/deleteById/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorBody =
          await parseJsonResponse<{
            error?: string;
          }>(response);

        throw new Error(
          errorBody?.error ||
          'Unable to delete credential'
        );
      }

      setItems((currentItems) =>
        currentItems.filter(
          (item) => item.id !== id
        )
      );

      if (editingItem?.id === id) {
        closeForm();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete credential'
      );
    }
  };

  // ============================================================
  // COPY
  // ============================================================

  const copyToClipboard = async (
    value: string
  ) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      setError(
        'Unable to copy to clipboard'
      );
    }
  };

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredItems = useMemo(() => {
    const query = search.toLowerCase();

    return items.filter(
      (item) =>
        item.appName
          .toLowerCase()
          .includes(query) ||
        item.loginUserId
          .toLowerCase()
          .includes(query) ||
        item.webAddress
          .toLowerCase()
          .includes(query)
    );
  }, [items, search]);

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">

      <div className="mx-auto max-w-5xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              ← Back to home
            </Link>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Password Manager
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Securely manage your passwords
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500">
              Keep your login details organized and
              easily accessible in one place.
            </p>

          </div>

          {/* =================================================
              HEADER ACTION
          ================================================= */}

          {ownerId ? (

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <span className="text-xl leading-none">
                +
              </span>

              Add Credential
            </button>

          ) : (

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Sign in
            </Link>

          )}

        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {/* =====================================================
            SUMMARY
        ====================================================== */}

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Credentials
            </p>

            <p className="mt-1 text-2xl font-bold">
              {ownerId ? items.length : '—'}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Saved Accounts
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {ownerId ? items.length : '—'}
            </p>

          </div>

          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-1">

            <p className="text-sm text-slate-500">
              Status
            </p>

            <p
              className={`mt-1 text-lg font-bold ${ownerId
                ? 'text-emerald-600'
                : 'text-orange-500'
                }`}
            >
              {ownerId
                ? 'Signed in'
                : 'Sign in required'}
            </p>

          </div>

        </div>

        {/* =====================================================
            SAVED CREDENTIALS
        ====================================================== */}

        <div>

          {/* =================================================
              SECTION HEADER
          ================================================== */}

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-xl font-bold">
                Saved Credentials
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {ownerId
                  ? `${items.length} saved ${items.length === 1
                    ? 'credential'
                    : 'credentials'
                  }`
                  : 'Sign in to view your saved credentials'}
              </p>

            </div>

            {ownerId && items.length > 0 && (

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search credentials..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 sm:w-64"
              />

            )}

          </div>

          {/* =================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500">
              Loading your credentials…
            </div>

          ) : !ownerId ? (

            /* =================================================
               NOT LOGGED IN
            ================================================== */

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                🔐
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                Please log in to manage your credentials
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Your saved credentials are securely
                synced with your account. Sign in to
                view, add and manage your credentials.
              </p>

              <Link
                href="/login"
                className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Sign in
              </Link>

            </div>

          ) : items.length === 0 ? (

            /* =================================================
               NO CREDENTIALS
            ================================================== */

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                🔐
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                No saved credentials yet
              </h2>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Add your first set of credentials
                and they will appear here.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                + Add Credential
              </button>

            </div>

          ) : (

            /* =================================================
               CREDENTIAL LIST
            ================================================== */

            <>

              {filteredItems.length === 0 ? (

                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

                  <p className="font-semibold">
                    No matching credentials
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try searching for another
                    application or website.
                  </p>

                </div>

              ) : (

                <div className="space-y-3">

                  {filteredItems.map((item) => (

                    <div
                      key={item.id}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                    >

                      <div className="flex flex-col gap-5">

                        {/* =================================================
                            MAIN ROW
                        ================================================== */}

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                          {/* Website */}

                          <div className="flex min-w-0 flex-1 items-center gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                              🔐
                            </div>

                            <div className="min-w-0">

                              <h3 className="truncate font-semibold">
                                {item.appName}
                              </h3>

                              {item.webAddress ? (

                                <a
                                  href={item.webAddress}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-1 block truncate text-xs text-slate-400 transition hover:text-emerald-600"
                                >
                                  {item.webAddress}
                                </a>

                              ) : (

                                <p className="mt-1 text-xs text-slate-400">
                                  No web address
                                </p>

                              )}

                            </div>

                          </div>

                          {/* =================================================
                              USER ID
                          ================================================== */}

                          <div className="sm:w-48">

                            <p className="text-xs font-medium text-slate-400">
                              USER ID
                            </p>

                            <div className="mt-1 flex items-center gap-2">

                              <p className="truncate text-sm font-medium">
                                {item.loginUserId}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(
                                    item.loginUserId
                                  )
                                }
                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                title="Copy user ID"
                              >
                                ⧉
                              </button>

                            </div>

                          </div>

                          {/* =================================================
                              PASSWORD
                          ================================================== */}

                          <div className="sm:w-40">

                            <p className="text-xs font-medium text-slate-400">
                              PASSWORD
                            </p>

                            <div className="mt-1 flex items-center gap-2">

                              <p className="font-mono text-sm tracking-wider">
                                ••••••••
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(
                                    item.password
                                  )
                                }
                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                title="Copy password"
                              >
                                ⧉
                              </button>

                            </div>

                          </div>

                          {/* =================================================
                              ACTIONS
                          ================================================== */}

                          <div className="flex shrink-0 items-center gap-2">

                            {/* Edit */}

                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(item)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                              title="Edit credential"
                              aria-label="Edit credential"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-4 w-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 20h9"
                                />

                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                                />
                              </svg>
                            </button>

                            {/* Delete */}

                            <button
                              type="button"
                              onClick={() =>
                                deleteItem(item.id)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md"
                              title="Delete credential"
                              aria-label="Delete credential"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-4 w-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 6h18"
                                />

                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8 6V4h8v2"
                                />

                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 6l-1 14H6L5 6"
                                />

                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M10 11v5M14 11v5"
                                />
                              </svg>
                            </button>

                          </div>

                        </div>

                        {/* =================================================
                            NOTE
                        ================================================== */}

                        {item.note && (

                          <div className="border-t border-slate-100 pt-4">

                            <div className="flex items-start gap-3">

                              <span className="text-sm">
                                📝
                              </span>

                              <div className="min-w-0">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                  Note
                                </p>

                                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                  {item.note}
                                </p>

                              </div>

                            </div>

                          </div>

                        )}

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </>

          )}

        </div>

      </div>

      {/* ==========================================================
          ADD / EDIT MODAL
      =========================================================== */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">

          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* =================================================
                MODAL HEADER
            ================================================== */}

            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 sm:px-8">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                  {editingItem
                    ? 'Edit Credentials'
                    : 'New Credentials'}
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Save your credentials safely
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Store your login information in
                  one place.
                </p>

              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-full p-2 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* =================================================
                MODAL BODY
            ================================================== */}

            <div className="overflow-y-auto px-6 py-6 sm:px-8">

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* =================================================
                    APPLICATION / WEBSITE
                ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                  <div className="mb-5 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                      🌐
                    </div>

                    <div>

                      <h3 className="font-semibold">
                        Application / Website
                      </h3>

                      <p className="text-xs text-slate-500">
                        Identify where this login is used
                      </p>

                    </div>

                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    {/* App Name */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        App / Website Name
                      </label>

                      <input
                        type="text"
                        value={appName}
                        onChange={(e) =>
                          setAppName(
                            e.target.value
                          )
                        }
                        placeholder="e.g. GitHub"
                        autoFocus
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />

                    </div>

                    {/* Web Address */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Web Address
                      </label>

                      <input
                        type="url"
                        value={webAddress}
                        onChange={(e) =>
                          setWebAddress(
                            e.target.value
                          )
                        }
                        placeholder="https://example.com"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />

                    </div>

                  </div>

                </div>

                {/* =================================================
                    LOGIN DETAILS
                ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                  <div className="mb-5 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                      👤
                    </div>

                    <div>

                      <h3 className="font-semibold">
                        Login Details
                      </h3>

                      <p className="text-xs text-slate-500">
                        Your username and password
                      </p>

                    </div>

                  </div>

                  <div className="space-y-5">

                    {/* User ID */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        User ID / Email
                      </label>

                      <input
                        type="text"
                        value={loginUserId}
                        onChange={(e) =>
                          setLoginUserId(
                            e.target.value
                          )
                        }
                        placeholder="Enter your username or email"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />

                    </div>

                    {/* Password */}

                    <div>

                      <div className="mb-2 flex items-center justify-between">

                        <label className="block text-sm font-semibold text-slate-700">
                          Password
                        </label>

                        <button
                          type="button"
                          onClick={
                            generatePassword
                          }
                          className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
                        >
                          Generate password
                        </button>

                      </div>

                      <div className="relative">

                        <input
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          value={password}
                          onChange={(e) =>
                            setPassword(
                              e.target.value
                            )
                          }
                          placeholder="Enter your password"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-20 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                        >
                          {showPassword
                            ? 'Hide'
                            : 'Show'}
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    ADDITIONAL NOTES
                ================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                  <div className="mb-5 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                      📝
                    </div>

                    <div>

                      <h3 className="font-semibold">
                        Additional Notes
                      </h3>

                      <p className="text-xs text-slate-500">
                        Save additional information
                        related to this account
                      </p>

                    </div>

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">

                      Note

                      <span className="ml-1 font-normal text-slate-400">
                        (optional)
                      </span>

                    </label>

                    <textarea
                      value={note}
                      onChange={(e) =>
                        setNote(e.target.value)
                      }
                      placeholder="Add any additional information..."
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />

                    <p className="mt-2 text-xs text-slate-400">
                      Example: Recovery information,
                      account details, security questions,
                      or other useful notes.
                    </p>

                  </div>

                </div>

                {/* =================================================
                    BUTTONS
                ================================================== */}

                <div className="flex gap-3 pt-2">

                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      !appName.trim() ||
                      !loginUserId.trim() ||
                      !password.trim() ||
                      saving
                    }
                    className="flex-1 rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {saving
                      ? 'Saving...'
                      : editingItem
                        ? 'Save Changes'
                        : 'Save'}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}