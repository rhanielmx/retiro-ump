import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await prisma.voteCategory.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
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
    const { name, order, isActive, allowMultipleWinners } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.voteCategory.aggregate({
      _max: { order: true },
    });

    const category = await prisma.voteCategory.create({
      data: {
        name,
        order: order ?? (maxOrder._max.order ?? 0) + 1,
        isActive: isActive ?? true,
        allowMultipleWinners: allowMultipleWinners ?? false,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
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
    const { id, name, order, isActive, allowMultipleWinners } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: 'ID e nome são obrigatórios' },
        { status: 400 }
      );
    }

    const category = await prisma.voteCategory.update({
      where: { id },
      data: {
        name,
        order: order ?? undefined,
        isActive: isActive ?? undefined,
        allowMultipleWinners: allowMultipleWinners ?? undefined,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria' },
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

    await prisma.voteCategory.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir categoria' },
      { status: 500 }
    );
  }
}
