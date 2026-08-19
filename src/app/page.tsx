import prisma from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';
import { ALL_MENU_ITEMS } from '@/data/menuData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let menuItems: any[] = [];
  let dbConnected = false;

  if (process.env.DATABASE_URL) {
    try {
      const dbItems = await prisma.menuItem.findMany({
        where: { isEnabled: true },
        orderBy: { orderIndex: 'asc' },
      });

      dbConnected = true;
      menuItems = dbItems.map((item) => {
        let imagesList: string[] = [];
        try {
          if (item.images) imagesList = JSON.parse(item.images);
          else if (item.imageUrl) imagesList = [item.imageUrl];
        } catch {
          imagesList = item.imageUrl ? [item.imageUrl] : [];
        }
        return {
          ...item,
          images: imagesList,
        };
      });
    } catch (error) {
      console.warn('Failed to fetch active menu items from DB, using fallback menu data.');
    }
  }

  // Only fallback if DB query failed or DB not configured
  if (!dbConnected) {
    menuItems = ALL_MENU_ITEMS;
  }

  return <HomeClient initialMenuItems={menuItems} />;
}
