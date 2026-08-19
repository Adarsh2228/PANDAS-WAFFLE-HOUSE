import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted = stories.map((s) => ({
      ...s,
      createdAt: s.createdAt ? new Date(s.createdAt).getTime() : Date.now(),
      expiresAt: s.expiresAt ? new Date(s.expiresAt).getTime() : undefined,
    }));

    return NextResponse.json(
      { success: true, data: formatted, count: formatted.length },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('API /api/stories GET error:', error);
    return NextResponse.json(
      { success: false, data: [], error: error?.message || 'Database unavailable' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, thumbnailUrl, caption, expiresAt } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'imageUrl is required' },
        { status: 400 }
      );
    }

    const newStory = await prisma.story.create({
      data: {
        id: `story-${Date.now()}`,
        imageUrl,
        thumbnailUrl: thumbnailUrl || imageUrl,
        caption: caption || '',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    const formatted = {
      ...newStory,
      createdAt: new Date(newStory.createdAt).getTime(),
      expiresAt: newStory.expiresAt ? new Date(newStory.expiresAt).getTime() : undefined,
    };

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error('API /api/stories POST error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create story' },
      { status: 500 }
    );
  }
}
