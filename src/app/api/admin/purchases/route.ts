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
    const shopId = searchParams.get('shopId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where: any = {};
    
    if (shopId && shopId !== 'all') {
      where.shopId = shopId;
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

    // Fetch purchases
    const purchases = await prisma.purchase.findMany({
      where,
      include: {
        shop: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar compras' },
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
      shopId,
      amount,
      items,
      date,
      receiptUrl,
      notes
    } = body;

    // Create new purchase
    const newPurchase = await prisma.purchase.create({
      data: {
        shopId,
        amount: parseFloat(amount),
        items: items ? JSON.stringify(items) : null,
        date: date ? new Date(date) : new Date(),
        receiptUrl: receiptUrl || null,
        notes: notes || null
      },
      include: {
        shop: true
      }
    });

    return NextResponse.json(newPurchase);
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json(
      { error: 'Erro ao criar compra' },
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
      shopId,
      amount,
      items,
      date,
      receiptUrl,
      notes
    } = body;

    // Update purchase
    const updatedPurchase = await prisma.purchase.update({
      where: { id },
      data: {
        shopId,
        amount: parseFloat(amount),
        items: items ? JSON.stringify(items) : null,
        date: date ? new Date(date) : new Date(),
        receiptUrl: receiptUrl || null,
        notes: notes || null
      },
      include: {
        shop: true
      }
    });

    return NextResponse.json(updatedPurchase);
  } catch (error) {
    console.error('Error updating purchase:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar compra' },
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
        { error: 'ID da compra é obrigatório' },
        { status: 400 }
      );
    }

    // Delete purchase
    await prisma.purchase.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir compra' },
      { status: 500 }
    );
  }
}