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

    // Validate ID
    if (!id || Number.isNaN(Number(id))) {
      return NextResponse.json(
        {
          message:
            'Missing or invalid password credential id',
        },
        {
          status: 400,
        }
      );
    }

    // Call Spring Boot backend
    const backendResponse = await fetch(
      `${BACKEND_API_BASE_URL}/api/v1/passwordManager/deleteById/${id}`,
      {
        method: 'DELETE',
      }
    );

    // ==========================================================
    // BACKEND ERROR
    // ==========================================================

    if (!backendResponse.ok) {
      const text = await backendResponse.text();

      let errorData: unknown = {
        message:
          text || backendResponse.statusText || 'Unable to delete credential',
      };

      try {
        if (text) {
          errorData = JSON.parse(text);
        }
      } catch {
        // Keep text-based error response
      }

      return NextResponse.json(errorData, {
        status: backendResponse.status,
      });
    }

    // ==========================================================
    // SUCCESS - NO CONTENT
    //
    // Spring Boot may return 204 No Content after deleting.
    // In that case, DO NOT use NextResponse.json().
    // ==========================================================

    if (backendResponse.status === 204) {
      return new NextResponse(null, {
        status: 204,
      });
    }

    // ==========================================================
    // SUCCESS - WITH RESPONSE BODY
    // ==========================================================

    const text = await backendResponse.text();

    // Backend returned successful response with no body
    if (!text) {
      return new NextResponse(null, {
        status: backendResponse.status,
      });
    }

    // Try JSON response
    try {
      const data = JSON.parse(text);

      return NextResponse.json(data, {
        status: backendResponse.status,
      });
    } catch {
      // Backend returned plain text
      return new NextResponse(text, {
        status: backendResponse.status,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  } catch (error) {
    console.error(
      'Delete password manager error:',
      error
    );

    return NextResponse.json(
      {
        message:
          'Unable to reach password manager service',
      },
      {
        status: 502,
      }
    );
  }
}