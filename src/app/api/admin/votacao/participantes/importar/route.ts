import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

interface ParticipantInput {
  name: string;
  nickname?: string;
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const { participants } = body;

    if (!participants || !Array.isArray(participants)) {
      return NextResponse.json(
        { error: 'Array de participantes é obrigatório' },
        { status: 400 }
      );
    }

    const validParticipants: ParticipantInput[] = participants
      .map((p: string | ParticipantInput) => {
        if (typeof p === 'string') {
          const parts = p.split('|').map((s: string) => s.trim());
          return {
            name: parts[0],
            nickname: parts[1] || undefined,
          };
        }
        return {
          name: p.name?.trim(),
          nickname: p.nickname?.trim() || undefined,
        };
      })
      .filter((p: ParticipantInput) => p.name && p.name.length > 0);

    if (validParticipants.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum participante válido fornecido' },
        { status: 400 }
      );
    }

    const existingParticipants = await prisma.participantVoting.findMany({
      where: { name: { in: validParticipants.map((p) => p.name) } },
      select: { name: true },
    });

    const existingNamesSet = new Set(
      existingParticipants.map((e) => e.name.toLowerCase())
    );

    const newParticipants = validParticipants.filter(
      (p: ParticipantInput) => !existingNamesSet.has(p.name.toLowerCase())
    );

    if (newParticipants.length === 0) {
      return NextResponse.json({
        message: 'Todos os participantes já existem',
        imported: 0,
        skipped: validParticipants.length,
      });
    }

    const created = await prisma.participantVoting.createMany({
      data: newParticipants.map((p: ParticipantInput) => ({
        name: p.name,
        nickname: p.nickname || null,
        isActive: true,
      })),
    });

    return NextResponse.json({
      message: `${created.count} participantes importados com sucesso`,
      imported: created.count,
      skipped: validParticipants.length - created.count,
    });
  } catch (error) {
    console.error('Error importing participants:', error);
    return NextResponse.json(
      { error: 'Erro ao importar participantes' },
      { status: 500 }
    );
  }
}
