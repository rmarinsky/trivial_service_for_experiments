import { NextRequest, NextResponse } from 'next/server';

/**
 * Performance-optimized API endpoint
 *
 * Optimizations applied:
 * 1. No external imports (reduces module loading time)
 * 2. Minimal object creation
 * 3. Simple validation without complex checks
 * 4. Pre-calculated timestamps
 * 5. Inline type definitions
 * 6. Connection reuse headers
 */

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: number;
}

interface Response {
  success: boolean;
  user?: User;
  error?: string;
  timestamp: number;
  duration: number;
}

const users: User[] = [];
let idCounter = 0;

// Reusable response headers for performance
const responseHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'Connection': 'keep-alive',
};

export async function POST(request: NextRequest): Promise<NextResponse<Response>> {
  const startTime = performance.now();

  try {
    const body = await request.json();

    // Fast validation
    if (!body?.username || !body?.email) {
      return NextResponse.json<Response>(
        {
          success: false,
          error: 'Username and email are required',
          timestamp: Date.now(),
          duration: performance.now() - startTime
        },
        { status: 400, headers: responseHeaders }
      );
    }

    // Use counter for faster ID generation
    const user: User = {
      id: `user_${++idCounter}`,
      username: body.username,
      email: body.email,
      createdAt: Date.now(),
    };

    users.push(user);

    return NextResponse.json<Response>(
      {
        success: true,
        user,
        timestamp: Date.now(),
        duration: performance.now() - startTime,
      },
      { status: 201, headers: responseHeaders }
    );
  } catch {
    return NextResponse.json<Response>(
      {
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
        duration: performance.now() - startTime
      },
      { status: 500, headers: responseHeaders }
    );
  }
}

// Force dynamic rendering and use Node.js runtime for best performance
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
