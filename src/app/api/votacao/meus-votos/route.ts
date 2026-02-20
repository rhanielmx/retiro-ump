import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID é obrigatório' },
        { status: 400 }
      );
    }

    const votes = await prisma.vote.findMany({
      where: { deviceId },
      select: {
        categoryId: true,
        participantIds: true,
      },
    });

    const votesMap: Record<string, string[]> = {};
    votes.forEach((vote) => {
      votesMap[vote.categoryId] = vote.participantIds;
    });

    return NextResponse.json(votesMap);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
