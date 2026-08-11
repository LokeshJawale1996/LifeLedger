'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAuthSession } from '../../lib/auth';

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? 'http://localhost:8080';

type TodoType = 'personal' | 'work' | 'shopping';

type Todo = {
  id: number;
  title: string;
  description: string;
  type: TodoType;
  completed: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

type ApiTodo = {
  id: number;
  todoTitle: string;
  description: string;
  type: string;
  completed: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

const typeStyles = {
  personal: 'bg-purple-50 text-purple-700 border-purple-200',
  work: 'bg-blue-50 text-blue-700 border-blue-200',
  shopping: 'bg-orange-50 text-orange-700 border-orange-200',
};

const typeLabels = {
  personal: 'Personal',
  work: 'Work',
  shopping: 'Shopping',
};

const apiTypeToUi: Record<string, TodoType> = {
  PERSONAL: 'personal',
  WORK: 'work',
  SHOPPING: 'shopping',
};

const uiTypeToApi: Record<TodoType, string> = {
  personal: 'PERSONAL',
  work: 'WORK',
  shopping: 'SHOPPING',
};

function mapApiTodo(todo: ApiTodo): Todo {
  return {
    id: todo.id,
    title: todo.todoTitle,
    description: todo.description,
    type: apiTypeToUi[todo.type] ?? 'personal',
    completed: todo.completed,
    userId: todo.userId,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
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

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TodoType>('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = getAuthSession();
    const id = session?.user?.id ?? session?.user?.userId;

    if (!id) {
      setUserId(null);
      setLoading(false);
      return;
    }

    setUserId(id);
    loadTodos(id);
  }, []);

  const loadTodos = async (id: number) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/todos/getByUserId/${id}`);
      if (!response.ok) {
        const errorBody = await parseJsonResponse<{ message?: string }>(response);
        throw new Error(errorBody?.message || 'Unable to load todos');
      }
      const data = await parseJsonResponse<ApiTodo[]>(response);
      setTodos(data.map(mapApiTodo));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load todos');
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingTodo(null);
    setTitle('');
    setDescription('');
    setType('personal');
    setShowForm(true);
  };

  const openEditForm = (todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
    setType(todo.type);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTodo(null);
    setTitle('');
    setDescription('');
    setType('personal');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !userId) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (editingTodo) {
        const response = await fetch(`/api/todos/updateById/${editingTodo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            todoTitle: title.trim(),
            description: description.trim(),
            type: uiTypeToApi[type],
          }),
        });

        if (!response.ok) {
          const errorBody = await parseJsonResponse<{ message?: string }>(response);
          throw new Error(errorBody?.message || 'Unable to update todo');
        }

        const updatedTodo = await parseJsonResponse<ApiTodo>(response);
        setTodos((currentTodos) =>
          currentTodos.map((todo) => (todo.id === updatedTodo.id ? mapApiTodo(updatedTodo) : todo))
        );
      } else {
        const response = await fetch('/api/todos/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            todoTitle: title.trim(),
            description: description.trim(),
            type: uiTypeToApi[type],
            userId,
          }),
        });

        if (!response.ok) {
          const errorBody = await parseJsonResponse<{ message?: string }>(response);
          throw new Error(errorBody?.message || 'Unable to create todo');
        }

        const createdTodo = await parseJsonResponse<ApiTodo>(response);
        setTodos((currentTodos) => [mapApiTodo(createdTodo), ...currentTodos]);
      }

      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save todo');
    } finally {
      setSaving(false);
    }
  };

  const toggleTodo = async (id: number) => {
    setError('');

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const errorBody = await parseJsonResponse<{ message?: string }>(response);
        throw new Error(errorBody?.message || 'Unable to update todo status');
      }

      const updatedTodo = await parseJsonResponse<ApiTodo>(response);
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id === updatedTodo.id ? mapApiTodo(updatedTodo) : todo))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update todo status');
    }
  };

  const deleteTodo = async (id: number | undefined) => {
    setError('');

    if (id === undefined || id === null) {
      setError('Unable to delete todo: missing todo id');
      return;
    }

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorBody = await parseJsonResponse<{ message?: string }>(response);
        throw new Error(errorBody?.message || 'Unable to delete todo');
      }

      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete todo');
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              ← Back to home
            </Link>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Todo List</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Organize your tasks and stay productive.</h1>
            <p className="mt-2 text-slate-500">Turn your plans into simple, manageable tasks and stay on top of what matters.</p>
          </div>
          <button
            type="button"
            onClick={openAddForm}
            disabled={!userId}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-xl leading-none">+</span>
            Add New Todo
          </button>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
        ) : null}

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Tasks</p>
            <p className="mt-1 text-2xl font-bold">{todos.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{completedCount}</p>
          </div>
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-1">
            <p className="text-sm text-slate-500">Remaining</p>
            <p className="mt-1 text-2xl font-bold text-orange-500">{todos.length - completedCount}</p>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500">Loading your todos…</div>
          ) : !userId ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <h2 className="text-lg font-semibold">Please log in to see your tasks</h2>
              <p className="mt-2 text-sm text-slate-500">Your todo list is synced with your account.</p>
              <Link href="/login" className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Sign in</Link>
            </div>
          ) : todos.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-3xl">✓</div>
              <h2 className="mt-4 text-lg font-semibold">No todos yet</h2>
              <p className="mt-1 text-sm text-slate-500">Add your first task and start organizing your day.</p>
              <button type="button" onClick={openAddForm} className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">+ Add Todo</button>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className={`group rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${todo.completed ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-200'}`}>
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${todo.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 hover:border-emerald-500'}`}
                    aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {todo.completed && '✓'}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className={`font-semibold ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{todo.title}</h2>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${typeStyles[todo.type]}`}>{typeLabels[todo.type]}</span>
                    </div>
                    {todo.description && <p className={`mt-1 text-sm ${todo.completed ? 'text-slate-400' : 'text-slate-500'}`}>{todo.description}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button onClick={() => openEditForm(todo)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md" title="Edit todo" aria-label="Edit todo">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </button>
                    <button onClick={() => deleteTodo(todo.id)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md" title="Delete todo" aria-label="Delete todo">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 6V4h8v2" /><path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14H6L5 6" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 11v5M14 11v5" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">{editingTodo ? 'Edit Todo' : 'New Todo'}</p>
                <h2 className="mt-1 text-2xl font-bold">{editingTodo ? 'Update your task' : 'What do you need to do?'}</h2>
              </div>
              <button onClick={closeForm} className="rounded-full p-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close">×</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Todo Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Complete project documentation" autoFocus className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Description <span className="ml-1 font-normal text-slate-400">(optional)</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add some details..." rows={3} className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Todo Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(typeLabels) as TodoType[]).map((todoType) => (
                    <button key={todoType} type="button" onClick={() => setType(todoType)} className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${type === todoType ? typeStyles[todoType] + ' ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>{typeLabels[todoType]}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="flex-1 rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={!title.trim() || saving} className="flex-1 rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">{editingTodo ? 'Save Changes' : 'Add Todo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
