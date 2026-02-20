import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let participants;
    
    if (search) {
      participants = await prisma.$queryRaw`
        SELECT id, name, nickname 
        FROM "participant_voting" 
        WHERE "isActive" = true 
        AND (
          unaccent(name) ILIKE unaccent(${`%${search}%`}) 
          OR unaccent(COALESCE(nickname, '')) ILIKE unaccent(${`%${search}%`})
        )
        ORDER BY name 
        LIMIT 20
      `;
    } else {
      participants = await prisma.participantVoting.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          nickname: true,
        },
        take: 20,
      });
    }

    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar participantes' },
      { status: 500 }
    );
  }
}
