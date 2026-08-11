import { NextResponse } from 'next/server';

export const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8080';

export async function proxyRequest(request: Request, backendPath: string, method: string, body?: unknown) {
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const backendResponse = await fetch(`${BACKEND_API_BASE_URL}${backendPath}`, init);

  if (backendResponse.status === 204) {
    return new NextResponse(null, {
      status: 204,
      statusText: backendResponse.statusText,
    });
  }

  const rawText = await backendResponse.text();
  let data: unknown = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = rawText;
    }
  }

  if (!backendResponse.ok) {
    return NextResponse.json(
      {
        error: typeof data === 'string' ? data : (data as object) || backendResponse.statusText,
      },
      {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
      }
    );
  }

  if (typeof data === 'string') {
    return NextResponse.json(
      { data },
      {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
      }
    );
  }

  return NextResponse.json(data ?? {}, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
  });
}
