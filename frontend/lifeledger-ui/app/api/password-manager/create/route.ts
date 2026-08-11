import { proxyRequest } from '../lib';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId || Number.isNaN(Number(userId))) {
    return new Response(JSON.stringify({ error: 'Missing or invalid userId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json();
  return proxyRequest(request, `/api/v1/passwordManager/create?userId=${encodeURIComponent(userId)}`, 'POST', body);
}
