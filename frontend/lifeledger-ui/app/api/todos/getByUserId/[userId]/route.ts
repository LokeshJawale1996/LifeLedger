import { proxyRequest } from '../../lib';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = await params;
  return proxyRequest(request, `/api/v1/todos/getByUserId/${userId}`, 'GET');
}
