export type AuthUser = {
  id?: number;
  userId?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  [key: string]: unknown;
};

export type AuthSession = {
  token?: string;
  user?: AuthUser;
};

const AUTH_STORAGE_KEY = 'lifeledger-auth';

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = path;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const rawText = await response.text();
  const data = rawText ? JSON.parse(rawText) : null;

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

export function computeFullName(user?: AuthUser | null) {
  if (!user) return undefined;
  const first = typeof user.firstName === 'string' ? user.firstName.trim() : '';
  const last = typeof user.lastName === 'string' ? user.lastName.trim() : '';
  const name = [first, last].filter(Boolean).join(' ');
  return name || undefined;
}

export function saveAuthSession(session: AuthSession | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!session) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  // Ensure we persist a computed fullName when possible
  if (session.user) {
    try {
      const computed = computeFullName(session.user);
      if (computed) {
        session.user.fullName = computed;
      }
    } catch {
      // ignore
    }
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearAuthSession() {
  saveAuthSession(null);
}

export function getUserDisplayName(user?: AuthUser | null) {
  if (!user) return 'User';

  // Prefer fullName when available from the backend
  if (typeof user.fullName === 'string' && user.fullName.trim()) {
    return user.fullName.trim();
  }

  const firstName = user.firstName?.trim();
  const lastName = user.lastName?.trim();

  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  return user.email || 'User';
}
