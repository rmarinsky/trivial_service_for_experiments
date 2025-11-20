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

function validateUserInput(body: unknown): body is CreateUserRequest {
  const data = body as Partial<CreateUserRequest>;
  return Boolean(data?.username && data?.email);
}

export async function POST(request: NextRequest) {
  const requestId = generateId('req');
  const requestStartTime = Date.now();

  logger.log(`Request received - Request ID: ${requestId}`);

  try {
    const body = await request.json();

    if (!validateUserInput(body)) {
      return NextResponse.json<Omit<ApiResponse, 'user'>>(
        {
          success: false,
          error: 'Username and email are required',
          timestamp: Date.now(),
          requestDuration: Date.now() - requestStartTime
        },
        { status: 400 }
      );
    }

    const { username, email } = body;

    const newUser: User = {
      id: generateId('user'),
      username,
      email,
      createdAt: Date.now(),
    };

    users.push(newUser);

    const requestEndTime = Date.now();
    const duration = requestEndTime - requestStartTime;

    logger.log(`Response sent - Request ID: ${requestId}, Duration: ${duration}ms`);

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
    logger.error(`Error - Request ID: ${requestId}`, error);
    return NextResponse.json<Omit<ApiResponse, 'user'>>(
      {
        success: false,
        error: 'Internal server error',
        timestamp: Date.now(),
        requestDuration: Date.now() - requestStartTime
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
