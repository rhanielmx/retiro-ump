import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authError = await requireAdminAuth(request);
    if (authError) {
      return authError;
    }

    // Fetch all participants with their data
    const participants = await prisma.participant.findMany({
      orderBy: {
        registeredAt: 'desc'
      },
      include: {
        payments: true
      }
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
    // Check authentication
    const authError = await requireAdminAuth(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const {
      id,
      paymentType,
      fullPrice,
      dailyRate,
      daysStayed,
      discount,
      totalAmount,
      paidAmount,
      status
    } = body;

    // Update participant payment information
    const updatedParticipant = await prisma.participant.update({
      where: { id },
      data: {
        paymentType,
        fullPrice: fullPrice ? parseFloat(fullPrice) : null,
        dailyRate: dailyRate ? parseFloat(dailyRate) : null,
        daysStayed: daysStayed ? parseInt(daysStayed) : null,
        discount: discount ? parseFloat(discount) : 0,
        totalAmount: totalAmount ? parseFloat(totalAmount) : null,
        paidAmount: paidAmount ? parseFloat(paidAmount) : 0,
        status,
        paidAt: status === 'PAID' ? new Date() : null
      }
    });

    return NextResponse.json(updatedParticipant);
  } catch (error) {
    console.error('Error updating participant:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar participante' },
      { status: 500 }
    );
  }
}
