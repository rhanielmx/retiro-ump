import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, requireAdminAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const { success, user } = await authenticateUser(username, password);

    if (!success) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Return success (the frontend will handle the authentication state)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Use the existing requireAdminAuth function to verify the token
  const authError = await requireAdminAuth(request);
  
  if (authError) {
    return authError;
  }

  // If we get here, the authentication is valid
  return NextResponse.json({ success: true });
}