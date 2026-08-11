import { proxyRequest } from '../../lib';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  if (!id || Number.isNaN(Number(id))) {
    return new Response(JSON.stringify({ error: 'Missing or invalid id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return proxyRequest(request, `/api/v1/passwordManager/deleteById/${id}`, 'DELETE');
}
