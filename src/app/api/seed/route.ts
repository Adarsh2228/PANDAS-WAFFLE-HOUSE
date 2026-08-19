import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ALL_MENU_ITEMS } from '@/data/menuData';

export async function POST() {
  try {
    let count = 0;
    for (let i = 0; i < ALL_MENU_ITEMS.length; i++) {
      const item = ALL_MENU_ITEMS[i];
      await prisma.menuItem.upsert({
        where: { id: item.id },
        update: {
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          category: item.category,
          imageUrl: item.imageUrl,
          images: JSON.stringify([item.imageUrl]),
          isEnabled: true,
          isTrending: item.isTrending ?? false,
          isOffer: item.category === 'Offers' || (item.isOffer ?? false),
          rating: item.rating ?? 0,
          reviewCount: item.reviewCount ?? 0,
          prepTime: item.prepTime || '5-7 mins',
          priceSmall: item.priceSmall ?? null,
          priceBig: item.priceBig ?? null,
          price5pc: item.price5pc ?? null,
          price10pc: item.price10pc ?? null,
          subtitle: item.subtitle ?? null,
          orderIndex: i,
        },
        create: {
          id: item.id,
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          category: item.category,
          imageUrl: item.imageUrl,
          images: JSON.stringify([item.imageUrl]),
          isEnabled: true,
          isTrending: item.isTrending ?? false,
          isOffer: item.category === 'Offers' || (item.isOffer ?? false),
          rating: item.rating ?? 0,
          reviewCount: item.reviewCount ?? 0,
          prepTime: item.prepTime || '5-7 mins',
          priceSmall: item.priceSmall ?? null,
          priceBig: item.priceBig ?? null,
          price5pc: item.price5pc ?? null,
          price10pc: item.price10pc ?? null,
          subtitle: item.subtitle ?? null,
          orderIndex: i,
        },
      });
      count++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${count} products into  MySQL!`,
      count,
    });
  } catch (error: any) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Database seed failed' },
      { status: 500 }
    );
  }
}
