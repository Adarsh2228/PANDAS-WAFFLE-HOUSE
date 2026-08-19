import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ItemDetailClient from '@/components/ItemDetailClient';

import { ALL_MENU_ITEMS } from '@/data/menuData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let menuItem: any = null;
  let toppings: any[] = [];

  if (process.env.DATABASE_URL) {
    try {
      menuItem = await prisma.menuItem.findUnique({
        where: { id },
        include: {
          reviews: {
            orderBy: { createdAt: 'desc' },
          }
        }
      });
      
      toppings = await prisma.topping.findMany();
    } catch (error) {
      console.warn("Failed to fetch item from DB, using fallback data.");
    }
  }

  if (!menuItem) {
    const found = ALL_MENU_ITEMS.find((i) => i.id === id);
    if (found) {
      menuItem = {
        ...found,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviews: [],
      };
    } else {
      menuItem = {
        id,
        name: 'Waffle House Special',
        description: 'A delicious panda specialty waffle freshly made for you.',
        basePrice: 150,
        category: 'Sandwich Waffle',
        imageUrl: 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?auto=format&fit=crop&q=80&w=800',
        isTrending: true,
        isEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviews: [],
      };
    }
  }

  return (
    <ItemDetailClient menuItem={menuItem} toppings={toppings} />
  );
}
