import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:8080';

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const backendResponse = await fetch(
      `${BACKEND_API_BASE_URL}/api/v1/password-manager/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const text = await backendResponse.text();

    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = {
        message: text || backendResponse.statusText,
      };
    }

    return NextResponse.json(data ?? {}, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error('Delete password manager error:', error);

    return NextResponse.json(
      {
        message: 'Unable to delete password credential',
      },
      {
        status: 502,
      }
    );
  }
}