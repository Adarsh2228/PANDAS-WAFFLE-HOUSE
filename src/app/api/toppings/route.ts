import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEFAULT_TOPPINGS } from '@/store/useStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    let toppings = await prisma.topping.findMany({
      orderBy: { createdAt: 'asc' },
    });

    if (toppings.length === 0) {
      for (const t of DEFAULT_TOPPINGS) {
        await prisma.topping.upsert({
          where: { id: t.id },
          create: {
            id: t.id,
            name: t.name,
            price: t.price,
          },
          update: {},
        }).catch(() => {});
      }
      toppings = await prisma.topping.findMany({
        orderBy: { createdAt: 'asc' },
      });
    }

    return NextResponse.json(
      { success: true, data: toppings, count: toppings.length },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('API /api/toppings GET error:', error);
    return NextResponse.json(
      { success: false, data: DEFAULT_TOPPINGS, error: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const id = `topping-${Date.now()}`;
    const newTopping = await prisma.topping.create({
      data: {
        id,
        name,
        price: Number(price),
      },
    });

    return NextResponse.json({ success: true, data: newTopping });
  } catch (error: any) {
    console.error('API /api/toppings POST error:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
