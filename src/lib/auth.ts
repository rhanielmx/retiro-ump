import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export async function authenticateUser(username: string, password: string): Promise<{ success: boolean; user?: any }> {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false };
  }
}

export async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  if (!username || !password) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  const { success, user } = await authenticateUser(username, password);

  if (!success || user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  return null;
}
