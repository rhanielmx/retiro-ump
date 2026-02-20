import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, participantId, participantIds, deviceId } = body;

    if (!categoryId || !deviceId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    const isMultiple = Array.isArray(participantIds) && participantIds.length > 0;
    const singleParticipantId = participantId;
    const multipleParticipantIds = participantIds;

    if (!isMultiple && !singleParticipantId) {
      return NextResponse.json(
        { error: 'Participante é obrigatório' },
        { status: 400 }
      );
    }

    const category = await prisma.voteCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category || !category.isActive) {
      return NextResponse.json(
        { error: 'Categoria não encontrada ou inativa' },
        { status: 404 }
      );
    }

    const participantIdList = isMultiple ? multipleParticipantIds : [singleParticipantId];

    for (const pid of participantIdList) {
      const participant = await prisma.participantVoting.findUnique({
        where: { id: pid },
      });

      if (!participant || !participant.isActive) {
        return NextResponse.json(
          { error: `Participante não encontrado ou inativo: ${pid}` },
          { status: 404 }
        );
      }
    }

    const sortedParticipantIds = [...participantIdList].sort();

    const existingVote = await prisma.vote.findUnique({
      where: {
        categoryId_deviceId: {
          categoryId,
          deviceId,
        },
      },
    });

    if (existingVote) {
      if (!category.allowMultipleWinners) {
        return NextResponse.json(
          { error: 'Você já votou nesta categoria' },
          { status: 409 }
        );
      }

      const existingGroup = [...existingVote.participantIds].sort();
      const isSameGroup = JSON.stringify(existingGroup) === JSON.stringify(sortedParticipantIds);

      if (isSameGroup) {
        return NextResponse.json(
          { error: 'Você já votou neste grupo nesta categoria' },
          { status: 409 }
        );
      }
    }

    if (existingVote && category.allowMultipleWinners) {
      await prisma.vote.update({
        where: { id: existingVote.id },
        data: {
          participantIds: {
            push: sortedParticipantIds,
          },
        },
      });
    } else {
      await prisma.vote.create({
        data: {
          categoryId,
          participantIds: sortedParticipantIds,
          deviceId,
        },
      });
    }

    return NextResponse.json(
      { message: 'Voto registrado com sucesso!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering vote:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
