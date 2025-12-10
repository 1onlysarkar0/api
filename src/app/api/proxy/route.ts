import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return handleProxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleProxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleProxyRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleProxyRequest(request, 'DELETE');
}

export async function PATCH(request: NextRequest) {
  return handleProxyRequest(request, 'PATCH');
}

async function handleProxyRequest(request: NextRequest, method: string) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Missing "url" query parameter' },
        { status: 400 }
      );
    }

    let decodedUrl: string;
    try {
      decodedUrl = decodeURIComponent(targetUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL encoding' },
        { status: 400 }
      );
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (method !== 'GET' && method !== 'HEAD') {
      try {
        const body = await request.text();
        if (body) {
          fetchOptions.body = body;
        }
      } catch {
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(decodedUrl, {
        ...fetchOptions,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const responseText = await response.text();

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      return NextResponse.json(
        { 
          data: responseData,
          status: response.status,
          statusText: response.statusText
        },
        { 
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout after 30 seconds' },
          { status: 504 }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Proxy request failed',
        details: 'Failed to connect to the target API. Please check the URL and try again.'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
