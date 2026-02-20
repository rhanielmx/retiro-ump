import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) {
      return authError;
    }

    const categories = await prisma.voteCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        votes: true,
      },
    });

    const participants = await prisma.participantVoting.findMany({
      select: { id: true, name: true },
    });

    const participantMap = new Map(participants.map((p) => [p.id, p.name]));

    const results = categories.map((category) => {
      const groupCount: Record<string, { groupIds: string[]; names: string[]; count: number }> = {};

      category.votes.forEach((vote) => {
        const sortedIds = [...vote.participantIds].sort();
        const key = JSON.stringify(sortedIds);

        if (!groupCount[key]) {
          const names = sortedIds.map((id) => participantMap.get(id) || 'Desconhecido');
          groupCount[key] = {
            groupIds: sortedIds,
            names,
            count: 0,
          };
        }
        groupCount[key].count++;
      });

      const ranking = Object.values(groupCount)
        .sort((a, b) => b.count - a.count)
        .map((item, index) => ({
          rank: index + 1,
          participantIds: item.groupIds,
          names: item.names,
          votes: item.count,
        }));

      return {
        categoryId: category.id,
        categoryName: category.name,
        allowMultipleWinners: category.allowMultipleWinners,
        totalVotes: category.votes.length,
        ranking,
      };
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar resultados' },
      { status: 500 }
    );
  }
}
