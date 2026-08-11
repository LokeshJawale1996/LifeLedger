import { NextResponse } from 'next/server';
import { proxyRequest } from '../lib';

function invalidIdResponse() {
  return NextResponse.json(
    { error: 'Missing or invalid todo id' },
    { status: 400 }
  );
}

function isValidId(id?: string) {
  return (
    !!id &&
    id !== 'undefined' &&
    !Number.isNaN(Number(id))
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const { id } = await params;

  if (!isValidId(id)) {
    return invalidIdResponse();
  }

  return proxyRequest(
    request,
    `/api/v1/todos/toggleCompletion/${id}`,
    'PATCH'
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const { id } = await params;

  if (!isValidId(id)) {
    return invalidIdResponse();
  }

  return proxyRequest(
    request,
    `/api/v1/todos/deleteById/${id}`,
    'DELETE'
  );
}