import { NextRequest, NextResponse } from 'next/server';

/**
 * Ultra-optimized API endpoint for minimal latency
 *
 * Optimizations:
 * 1. Minimal validation (performance vs safety tradeoff)
 * 2. No logging (I/O operations add latency)
 * 3. Minimal object creation
 * 4. Pre-allocated response structure
 * 5. No timestamp formatting
 * 6. In-memory only (no I/O)
 */

const users: Array<{ i: string; u: string; e: string; t: number }> = [];
let counter = 0;

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Minimal validation - just check existence
  if (!body?.username || !body?.email) {
    return NextResponse.json(
      { s: false, e: 'Invalid input' },
      { status: 400 }
    );
  }

  // Use counter instead of Date.now() for ID (faster)
  const id = `u${++counter}`;
  const now = Date.now();

  const user = {
    i: id,
    u: body.username,
    e: body.email,
    t: now
  };

  users.push(user);

  // Minimal response structure
  return NextResponse.json(
    {
      s: true,
      d: user
    },
    {
      status: 201,
      headers: {
        'Cache-Control': 'no-store',
        'Connection': 'keep-alive'
      }
    }
  );
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
