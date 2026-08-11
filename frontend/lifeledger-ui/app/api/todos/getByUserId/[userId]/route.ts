import { proxyRequest } from '../../lib';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId || Number.isNaN(Number(userId))) {
    return new Response(
      JSON.stringify({
        error: 'Missing or invalid userId',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return proxyRequest(
    request,
    `/api/v1/todos/getByUserId/${userId}`,
    'GET'
  );
}