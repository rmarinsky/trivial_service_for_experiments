import { NextRequest, NextResponse } from 'next/server';
import { User, ApiResponse } from '@/types/user';
import { generateId } from '@/lib/id-generator';
import { Logger } from '@/lib/logger';

const logger = new Logger('API');
const users: User[] = [];

interface CreateUserRequest {
  username: string;
  email: string;
}

function isValidUserInput(body: unknown): body is CreateUserRequest {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const data = body as Record<string, unknown>;
  return (
    typeof data.username === 'string' &&
    typeof data.email === 'string' &&
    data.username.trim().length > 0 &&
    data.email.trim().length > 0
  );
}

export async function POST(request: NextRequest) {
  const requestId = generateId('req');
  const requestStartTime = Date.now();

  logger.log(`Request received - Request ID: ${requestId}`);

  try {
    const body = await request.json();

    if (!isValidUserInput(body)) {
      const duration = Date.now() - requestStartTime;
      logger.log(`Validation failed - Request ID: ${requestId}, Duration: ${duration}ms`);

      return NextResponse.json<Omit<ApiResponse, 'user'>>(
        {
          success: false,
          error: 'Username and email are required and cannot be empty',
          timestamp: Date.now(),
          requestDuration: duration,
        },
        { status: 400, headers: { 'X-Request-ID': requestId } }
      );
    }

    const { username, email } = body;

    const newUser: User = {
      id: generateId('user'),
      username: username.trim(),
      email: email.trim(),
      createdAt: Date.now(),
    };

    users.push(newUser);

    const duration = Date.now() - requestStartTime;
    logger.log(`User created - Request ID: ${requestId}, Duration: ${duration}ms`);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        user: newUser,
        timestamp: Date.now(),
        requestDuration: duration,
      },
      {
        status: 201,
        headers: {
          'X-Request-ID': requestId,
        },
      }
    );
  } catch (error) {
    const duration = Date.now() - requestStartTime;
    logger.error(`Error - Request ID: ${requestId}`, error);

    return NextResponse.json<Omit<ApiResponse, 'user'>>(
      {
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
        requestDuration: duration,
      },
      { status: 500, headers: { 'X-Request-ID': requestId } }
    );
  }
}

export async function GET() {
  logger.log('GET all users');
  return NextResponse.json({
    success: true,
    users,
    count: users.length,
    timestamp: Date.now(),
  });
}
