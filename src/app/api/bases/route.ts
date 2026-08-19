import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEFAULT_WAFFLE_BASES } from '@/store/useStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    let bases = await prisma.waffleBase.findMany({
      orderBy: { createdAt: 'asc' },
    });

    if (bases.length === 0) {
      for (const b of DEFAULT_WAFFLE_BASES) {
        await prisma.waffleBase.upsert({
          where: { id: b.id },
          create: {
            id: b.id,
            name: b.name,
            description: b.description,
            price: b.price,
            icon: b.icon || '🧇',
          },
          update: {},
        }).catch(() => {});
      }
      bases = await prisma.waffleBase.findMany({
        orderBy: { createdAt: 'asc' },
      });
    }

    return NextResponse.json(
      { success: true, data: bases, count: bases.length },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('API /api/bases GET error:', error);
    return NextResponse.json(
      { success: false, data: DEFAULT_WAFFLE_BASES, error: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description = '', price, icon = '🧇' } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const id = `base-${Date.now()}`;
    const newBase = await prisma.waffleBase.create({
      data: {
        id,
        name,
        description,
        price: Number(price),
        icon,
      },
    });

    return NextResponse.json({ success: true, data: newBase });
  } catch (error: any) {
    console.error('API /api/bases POST error:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
