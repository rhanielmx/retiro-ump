import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      age,
      church,
      emergencyContact,
      emergencyPhone,
      foodRestrictions,
      medications,
      observations,
    } = body;

    // Basic validation
    if (!name || !phone || !age || !emergencyContact || !emergencyPhone) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    // Create participant with default payment values
    const participant = await prisma.participant.create({
      data: {
        name,
        phone,
        age: parseInt(age),
        church,
        emergencyContact,
        emergencyPhone,
        foodRestrictions,
        medications,
        observations,
        // Set default payment values for full retiro
        paymentType: 'FULL',
        fullPrice: 230.00,
        totalAmount: 230.00,
      },
    });

    return NextResponse.json(
      { message: 'Inscrição realizada com sucesso!', participant },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
