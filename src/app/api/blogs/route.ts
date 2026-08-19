import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const DEFAULT_STARTER_BLOGS = [
  {
    id: 'blog-1',
    title: 'The Art of the Perfect Belgian Waffle',
    subtitle: 'From golden crispy edges to light airy pockets: our master baker shares the secret.',
    category: 'Baking Secrets',
    emoji: '🧇',
    readTime: '3 min read',
    date: 'Aug 18, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f9cbc?auto=format&fit=crop&q=80&w=800',
    color: '#D97706',
    content: 'Crispy on the outside, fluffy and buttery on the inside. Discover how authentic Belgian pearl sugar transforms every bite into caramel heaven.',
    instagramUrl: '',
    enabled: true,
  },
  {
    id: 'blog-2',
    title: 'Why Nutella & Biscoff Are the Ultimate Duo',
    subtitle: 'A match made in dessert heaven: the science of pairing hazelnut and spiced caramel.',
    category: 'Foodie Trends',
    emoji: '🍫',
    readTime: '4 min read',
    date: 'Aug 15, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=800',
    color: '#0D9488',
    content: 'Layered warm chocolate ganache and crunchy speculoos biscuits make this waffle topping combo our most requested item of all time.',
    instagramUrl: '',
    enabled: true,
  },
  {
    id: 'blog-3',
    title: 'Behind the Scenes: A Day at Pandas Waffle House',
    subtitle: 'Fresh batter, warm irons, and happy smiles. Step into our cozy kitchen.',
    category: 'Our Story',
    emoji: '🐼',
    readTime: '5 min read',
    date: 'Aug 10, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800',
    color: '#E11D48',
    content: 'Every morning at 8:00 AM, the sweet aroma of melted chocolate and vanilla batter fills our cozy bakery.',
    instagramUrl: '',
    enabled: true,
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get('all') === 'true';

  try {
    const whereClause = includeAll ? {} : { enabled: true };
    const posts = await prisma.blogPost.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      { success: true, data: posts, count: posts.length },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('API /api/blogs GET error:', error);
    return NextResponse.json(
      { success: false, data: DEFAULT_STARTER_BLOGS, isFallback: true, error: error?.message },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      category,
      emoji = '🧇',
      readTime = '3 min read',
      date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      imageUrl = '',
      color = '#0D9488',
      content = '',
      instagramUrl = '',
      enabled = true,
      expiresAt,
    } = body;

    if (!title || !category) {
      return NextResponse.json(
        { success: false, error: 'Title and category are required' },
        { status: 400 }
      );
    }

    const newPost = await prisma.blogPost.create({
      data: {
        id: `blog-${Date.now()}`,
        title,
        subtitle: subtitle || '',
        category,
        emoji,
        readTime,
        date,
        imageUrl,
        color,
        content,
        instagramUrl,
        enabled: Boolean(enabled),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ success: true, data: newPost });
  } catch (error: any) {
    console.error('API /api/blogs POST error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
