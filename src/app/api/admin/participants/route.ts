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

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const authError = await requireAdminAuth(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const {
      id,
      name,
      phone,
      age,
      church,
      emergencyContact,
      emergencyPhone,
      foodRestrictions,
      medications,
      observations,
      paymentType,
      fullPrice,
      dailyRate,
      daysStayed,
      discount,
      totalAmount,
      paidAmount,
      status
    } = body;

    // Update participant information
    const updatedParticipant = await prisma.participant.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(age && { age: parseInt(age) }),
        ...(church !== undefined && { church }),
        ...(emergencyContact && { emergencyContact }),
        ...(emergencyPhone && { emergencyPhone }),
        ...(foodRestrictions !== undefined && { foodRestrictions }),
        ...(medications !== undefined && { medications }),
        ...(observations !== undefined && { observations }),
        ...(paymentType && { paymentType }),
        ...(fullPrice !== undefined && { fullPrice: parseFloat(fullPrice) }),
        ...(dailyRate !== undefined && { dailyRate: parseFloat(dailyRate) }),
        ...(daysStayed !== undefined && { daysStayed: parseInt(daysStayed) }),
        ...(discount !== undefined && { discount: parseFloat(discount) }),
        ...(totalAmount !== undefined && { totalAmount: parseFloat(totalAmount) }),
        ...(paidAmount !== undefined && { paidAmount: parseFloat(paidAmount) }),
        ...(status && { status }),
        ...(status === 'PAID' && { paidAt: new Date() })
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

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const authError = await requireAdminAuth(request);
    if (authError) {
      return authError;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do participante é obrigatório' },
        { status: 400 }
      );
    }

    // Delete participant's payments first (due to foreign key constraint)
    await prisma.payment.deleteMany({
      where: { participantId: id }
    });

    // Delete participant
    await prisma.participant.delete({
      where: { id }
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
