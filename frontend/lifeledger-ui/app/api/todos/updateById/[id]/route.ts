import { proxyRequest } from '../../lib';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const body = await request.json();
  return proxyRequest(request, `/api/v1/todos/updateById/${id}`, 'PUT', body);
}
