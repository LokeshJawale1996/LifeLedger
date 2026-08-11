import { proxyRequest } from '../lib';

export async function POST(request: Request) {
  const body = await request.json();
  return proxyRequest(request, '/api/v1/todos/create', 'POST', body);
}
