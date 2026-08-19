import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ALL_MENU_ITEMS } from '@/data/menuData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get('all') === 'true';

  try {
    const whereClause = includeAll ? {} : { isEnabled: true };
    const items = await prisma.menuItem.findMany({
      where: whereClause,
      orderBy: { orderIndex: 'asc' },
    });

    // Parse images json string if stored
    const formatted = items.map((item) => {
      let imagesList: string[] = [];
      try {
        if (item.images) {
          imagesList = JSON.parse(item.images);
        } else if (item.imageUrl) {
          imagesList = [item.imageUrl];
        }
      } catch {
        imagesList = item.imageUrl ? [item.imageUrl] : [];
      }

      return {
        ...item,
        images: imagesList,
      };
    });

    return NextResponse.json(
      { success: true, data: formatted, count: formatted.length },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error: any) {
    console.error('API /api/products GET error:', error);
    // Fallback ONLY if database is unreachable
    const fallback = includeAll
      ? ALL_MENU_ITEMS
      : ALL_MENU_ITEMS.filter((i) => (i as any).isEnabled !== false);
    return NextResponse.json(
      {
        success: false,
        data: fallback,
        isFallback: true,
        error: error?.message || 'Database unavailable',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      description,
      basePrice,
      category,
      imageUrl,
      images,
      isEnabled = true,
      isTrending = false,
      isOffer = false,
      prepTime = '5-7 mins',
      priceSmall,
      priceBig,
      price5pc,
      price10pc,
      subtitle,
    } = body;

    if (!name || basePrice === undefined || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (name, basePrice, category)' },
        { status: 400 }
      );
    }

    const productId = id || `prod-${Date.now()}`;
    const imagesJson = Array.isArray(images)
      ? JSON.stringify(images)
      : imageUrl
      ? JSON.stringify([imageUrl])
      : '[]';

    const newItem = await prisma.menuItem.create({
      data: {
        id: productId,
        name,
        description: description || '',
        basePrice: Number(basePrice),
        category,
        imageUrl: imageUrl || (Array.isArray(images) && images[0]) || '',
        images: imagesJson,
        isEnabled: Boolean(isEnabled),
        isTrending: Boolean(isTrending),
        isOffer: Boolean(isOffer),
        prepTime,
        priceSmall: priceSmall ? Number(priceSmall) : null,
        priceBig: priceBig ? Number(priceBig) : null,
        price5pc: price5pc ? Number(price5pc) : null,
        price10pc: price10pc ? Number(price10pc) : null,
        subtitle: subtitle || null,
      },
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error: any) {
    console.error('API /api/products POST error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
