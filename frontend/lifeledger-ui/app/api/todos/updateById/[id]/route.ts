import { proxyRequest } from '../../lib';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || Number.isNaN(Number(id))) {
    return new Response(
      JSON.stringify({
        error: 'Missing or invalid todo id',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  const body = await request.json();

  return proxyRequest(
    request,
    `/api/v1/todos/updateById/${id}`,
    'PUT',
    body
  );
}