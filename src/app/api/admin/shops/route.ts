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
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Fetch shops
    const shops = await prisma.shop.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: {
        name: 'asc'
      },
      include: {
        purchases: {
          orderBy: {
            date: 'desc'
          },
          take: 5 // Include only recent purchases
        }
      }
    });

    return NextResponse.json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar lojas' },
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
      name,
      contact
    } = body;

    // Create new shop
    const newShop = await prisma.shop.create({
      data: {
        name,
        contact: contact || null
      }
    });

    return NextResponse.json(newShop);
  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json(
      { error: 'Erro ao criar loja' },
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
      contact,
      isActive
    } = body;

    // Update shop
    const updatedShop = await prisma.shop.update({
      where: { id },
      data: {
        name,
        contact: contact || null,
        isActive: isActive !== undefined ? isActive : undefined
      }
    });

    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error('Error updating shop:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar loja' },
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
        { error: 'ID da loja é obrigatório' },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.shop.update({
      where: { id },
      data: { isActive: false }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shop:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir loja' },
      { status: 500 }
    );
  }
}