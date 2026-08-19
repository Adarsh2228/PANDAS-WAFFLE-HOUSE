import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const enabledOnly = searchParams.get('enabled') === 'true';

    const now = new Date();
    const offers = await prisma.offer.findMany({
      where: {
        ...(enabledOnly ? { isEnabled: true } : {}),
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    const mapped = offers.map((o) => ({
      ...o,
      expiresAt: o.expiresAt ? o.expiresAt.getTime() : undefined,
      createdAt: o.createdAt ? o.createdAt.getTime() : undefined,
    }));

    return NextResponse.json({ success: true, data: mapped, count: mapped.length });
  } catch (err) {
    console.error('[/api/offers GET]', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      subtitle,
      badge = 'OFFER',
      badgeColor = '#059669',
      imageUrl,
      instagramUrl,
      postType = 'image',
      gradient = '135deg,#065F46,#059669',
      ctaText = 'Order Now',
      ctaUrl,
      isEnabled = true,
      expiresAt,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    // Sanitize Instagram URL
    let cleanInstagram = instagramUrl || null;
    if (cleanInstagram) {
      // Only allow instagram.com URLs
      try {
        const parsed = new URL(cleanInstagram);
        if (!parsed.hostname.includes('instagram.com')) {
          cleanInstagram = null;
        }
      } catch {
        cleanInstagram = null;
      }
    }

    const offer = await prisma.offer.create({
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        badge: badge.trim() || 'OFFER',
        badgeColor: badgeColor || '#059669',
        imageUrl: imageUrl || null,
        instagramUrl: cleanInstagram,
        postType,
        gradient,
        ctaText: ctaText || 'Order Now',
        ctaUrl: ctaUrl || null,
        isEnabled,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...offer,
        expiresAt: offer.expiresAt ? offer.expiresAt.getTime() : undefined,
        createdAt: offer.createdAt ? offer.createdAt.getTime() : undefined,
      },
    });
  } catch (err) {
    console.error('[/api/offers POST]', err);
    return NextResponse.json({ success: false, error: 'Failed to create offer' }, { status: 500 });
  }
}
