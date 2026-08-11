import { proxyRequest } from '../../lib';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  if (!id || Number.isNaN(Number(id))) {
    return new Response(JSON.stringify({ error: 'Missing or invalid id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = undefined;
  }

  return proxyRequest(request, `/api/v1/passwordManager/updateById/${id}`, 'PUT', body);
}
