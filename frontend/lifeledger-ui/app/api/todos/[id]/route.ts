import { NextResponse } from 'next/server';
import { proxyRequest } from '../lib';

function invalidIdResponse() {
  return NextResponse.json(
    { error: 'Missing or invalid todo id' },
    { status: 400 }
  );
}

function extractIdFromUrl(url: string) {
  const path = new URL(url).pathname;
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  if (lastSegment && lastSegment !== 'todos' && !Number.isNaN(Number(lastSegment))) {
    return lastSegment;
  }
  return null;
}

function getId(params: { id?: string } | undefined, requestUrl: string) {
  const id = params?.id;
  if (id && id !== 'undefined' && !Number.isNaN(Number(id))) {
    return id;
  }
  return extractIdFromUrl(requestUrl);
}

export async function PATCH(request: Request, { params }: { params: { id?: string } }) {
  const id = getId(params, request.url);
  if (!id) {
    return invalidIdResponse();
  }
  return proxyRequest(request, `/api/v1/todos/toggleCompletion/${id}`, 'PATCH');
}

export async function DELETE(request: Request, { params }: { params: { id?: string } }) {
  const id = getId(params, request.url);
  if (!id) {
    return invalidIdResponse();
  }
  return proxyRequest(request, `/api/v1/todos/deleteById/${id}`, 'DELETE');
}
