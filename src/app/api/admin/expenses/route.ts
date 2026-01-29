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

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // Fetch expenses
    const expenses = await prisma.expense.findMany({
      where,
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar despesas' },
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
      description,
      amount,
      category,
      date,
      receiptUrl,
      notes
    } = body;

    // Create new expense
    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        category,
        date: date ? new Date(date) : new Date(),
        receiptUrl: receiptUrl || null,
        notes: notes || null
      }
    });

    return NextResponse.json(newExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Erro ao criar despesa' },
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
      description,
      amount,
      category,
      date,
      receiptUrl,
      notes
    } = body;

    // Update expense
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        description,
        amount: parseFloat(amount),
        category,
        date: date ? new Date(date) : new Date(),
        receiptUrl: receiptUrl || null,
        notes: notes || null
      }
    });

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar despesa' },
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
        { error: 'ID da despesa é obrigatório' },
        { status: 400 }
      );
    }

    // Delete expense
    await prisma.expense.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir despesa' },
      { status: 500 }
    );
  }
}