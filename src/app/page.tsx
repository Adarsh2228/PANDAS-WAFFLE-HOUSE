import prisma from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';
import { MOCK_MENU_ITEMS } from '@/data/mockItems';

export const revalidate = 60;

export default async function Home() {
  let menuItems: any[] = [];
  
  if (process.env.DATABASE_URL) {
    try {
      menuItems = await prisma.menuItem.findMany();
    } catch (error) {
      console.warn("Failed to fetch menu items from DB, using fallback data.");
    }
  }

  // Fallback to MOCK_MENU_ITEMS if DB is not connected or empty
  if (menuItems.length === 0) {
    menuItems = MOCK_MENU_ITEMS;
  }

  return <HomeClient initialMenuItems={menuItems} />;
}
