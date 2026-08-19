import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { isEnabled } = await request.json();
    if (isEnabled === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing isEnabled parameter' },
        { status: 400 }
      );
    }

    const updated = await prisma.menuItem.updateMany({
      data: {
        isEnabled: Boolean(isEnabled),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Updated ${updated.count} products to ${isEnabled ? 'enabled' : 'disabled'}`,
      count: updated.count,
    });
  } catch (error: any) {
    console.error('Bulk toggle error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to bulk toggle' },
      { status: 500 }
    );
  }
}
