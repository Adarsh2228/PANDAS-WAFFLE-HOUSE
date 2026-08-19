import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await prisma.offer.update({
      where: { id },
      data: body,
    });
    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        expiresAt: updated.expiresAt ? updated.expiresAt.getTime() : undefined,
        createdAt: updated.createdAt ? updated.createdAt.getTime() : undefined,
      },
    });
  } catch (err) {
    console.error('[/api/offers/[id] PATCH]', err);
    return NextResponse.json({ success: false, error: 'Failed to update offer' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      title, subtitle, badge, badgeColor, imageUrl, instagramUrl,
      postType, gradient, ctaText, ctaUrl, isEnabled, expiresAt,
    } = body;

    // Sanitize Instagram URL
    let cleanInstagram = instagramUrl || null;
    if (cleanInstagram) {
      try {
        const parsed = new URL(cleanInstagram);
        if (!parsed.hostname.includes('instagram.com')) cleanInstagram = null;
      } catch { cleanInstagram = null; }
    }

    const updated = await prisma.offer.update({
      where: { id },
      data: {
        title: title?.trim(),
        subtitle: subtitle?.trim() || null,
        badge: badge || 'OFFER',
        badgeColor: badgeColor || '#059669',
        imageUrl: imageUrl || null,
        instagramUrl: cleanInstagram,
        postType: postType || 'image',
        gradient: gradient || '135deg,#065F46,#059669',
        ctaText: ctaText || 'Order Now',
        ctaUrl: ctaUrl || null,
        isEnabled: isEnabled ?? true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        expiresAt: updated.expiresAt ? updated.expiresAt.getTime() : undefined,
        createdAt: updated.createdAt ? updated.createdAt.getTime() : undefined,
      },
    });
  } catch (err) {
    console.error('[/api/offers/[id] PUT]', err);
    return NextResponse.json({ success: false, error: 'Failed to replace offer' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.offer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[/api/offers/[id] DELETE]', err);
    return NextResponse.json({ success: false, error: 'Failed to delete offer' }, { status: 500 });
  }
}
