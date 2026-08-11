import { NextResponse } from 'next/server';

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:8080';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendResponse = await fetch(`${BACKEND_API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await backendResponse.text();
    const data = text ? JSON.parse(text) : null;

    return NextResponse.json(data ?? {}, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to reach auth service' }, { status: 502 });
  }
}
