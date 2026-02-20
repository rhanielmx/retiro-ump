import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) {
      return authError;
    }

    const participants = await prisma.participantVoting.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar participantes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const { name, nickname, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const participant = await prisma.participantVoting.create({
      data: {
        name,
        nickname: nickname || null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json(
      { error: 'Erro ao criar participante' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const { id, name, nickname, isActive } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: 'ID e nome são obrigatórios' },
        { status: 400 }
      );
    }

    const participant = await prisma.participantVoting.update({
      where: { id },
      data: {
        name,
        nickname: nickname !== undefined ? (nickname || null) : undefined,
        isActive: isActive ?? undefined,
      },
    });

    return NextResponse.json(participant);
  } catch (error) {
    console.error('Error updating participant:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar participante' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) {
      return authError;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID é obrigatório' },
        { status: 400 }
      );
    }

    await prisma.participantVoting.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Participante excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir participante' },
      { status: 500 }
    );
  }
}
