import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const { names } = body;

    if (!names || !Array.isArray(names)) {
      return NextResponse.json(
        { error: 'Array de nomes é obrigatório' },
        { status: 400 }
      );
    }

    const validNames = names
      .map((n: string) => n.trim())
      .filter((n: string) => n.length > 0);

    if (validNames.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum nome válido fornecido' },
        { status: 400 }
      );
    }

    const existingNames = await prisma.voteCategory.findMany({
      where: { name: { in: validNames } },
      select: { name: true },
    });

    const existingNamesSet = new Set(
      existingNames.map((e) => e.name.toLowerCase())
    );

    const newNames = validNames.filter(
      (name: string) => !existingNamesSet.has(name.toLowerCase())
    );

    if (newNames.length === 0) {
      return NextResponse.json({
        message: 'Todas as categorias já existem',
        imported: 0,
        skipped: validNames.length,
      });
    }

    const maxOrder = await prisma.voteCategory.aggregate({
      _max: { order: true },
    });

    const categories = await prisma.voteCategory.createMany({
      data: newNames.map((name: string, index: number) => ({
        name,
        order: (maxOrder._max.order ?? 0) + index + 1,
        isActive: true,
      })),
    });

    return NextResponse.json({
      message: `${categories.count} categorias importadas com sucesso`,
      imported: categories.count,
      skipped: validNames.length - categories.count,
    });
  } catch (error) {
    console.error('Error importing categories:', error);
    return NextResponse.json(
      { error: 'Erro ao importar categorias' },
      { status: 500 }
    );
  }
}
