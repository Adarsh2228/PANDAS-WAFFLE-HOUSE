import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ItemDetailClient from '@/components/ItemDetailClient';

export const revalidate = 60;

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
    // Return a dummy object if DB is not seeded so UI can be tested
    menuItem = {
      id,
      name: 'Dummy Waffle',
      description: 'A delicious placeholder waffle for testing.',
      basePrice: 150,
      category: 'Offers',
      imageUrl: '',
      isTrending: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      reviews: [
        { id: 'r1', menuItemId: id, rating: 5, comment: 'So good!', createdAt: new Date(), updatedAt: new Date() }
      ]
    };
    toppings = [
      { id: 't1', name: 'Extra Chocolate', price: 20, createdAt: new Date(), updatedAt: new Date() },
      { id: 't2', name: 'Strawberries', price: 30, createdAt: new Date(), updatedAt: new Date() },
    ];
  }

  return (
    <ItemDetailClient menuItem={menuItem} toppings={toppings} />
  );
}
