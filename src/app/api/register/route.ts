import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      age,
      church,
      emergencyContact,
      emergencyPhone,
      foodRestrictions,
      observations,
    } = body;

    // Basic validation
    if (!name || !email || !phone || !age || !emergencyContact || !emergencyPhone) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingParticipant = await prisma.participant.findUnique({
      where: { email },
    });

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 409 }
      );
    }

    // Create participant
    const participant = await prisma.participant.create({
      data: {
        name,
        email,
        phone,
        age: parseInt(age),
        church,
        emergencyContact,
        emergencyPhone,
        foodRestrictions,
        observations,
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
