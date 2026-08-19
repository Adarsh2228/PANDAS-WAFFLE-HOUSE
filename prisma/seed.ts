import { PrismaClient } from '@prisma/client';
import { ALL_MENU_ITEMS } from '../src/data/menuData';

const prisma = new PrismaClient();

const DEFAULT_WAFFLE_BASES = [
  { id: 'base-1', name: 'Classic Golden Belgian Waffle', description: 'Crispy exterior, soft airy interior', price: 0, icon: '🧇' },
  { id: 'base-2', name: 'Double Chocolate Dark Waffle', description: 'Infused with 70% dark Belgian cocoa', price: 30, icon: '🍩' },
  { id: 'base-3', name: 'Crispy Golden Waffle Bowl', description: 'Bowl shape perfect for sauces and toppings', price: 25, icon: '🥣' },
  { id: 'base-4', name: 'Pan Cake Stack', description: 'Fluffy pancake stack ready for your toppings', price: 20, icon: '🥞' },
  { id: 'base-5', name: 'Sandwich Waffle', description: 'Two crispy waffle layers with filling inside', price: 15, icon: '🥪' },
];

const DEFAULT_TOPPINGS = [
  { id: 'top-1', name: 'Warm Belgian Chocolate Drizzle', price: 30 },
  { id: 'top-2', name: 'Extra Nutella Spread', price: 40 },
  { id: 'top-3', name: 'Fresh Blueberries & Raspberries', price: 40 },
  { id: 'top-4', name: 'Crushed Oreos & KitKat', price: 25 },
  { id: 'top-5', name: 'Extra Whipped Cream', price: 20 },
  { id: 'top-6', name: 'Biscoff Spread', price: 35 },
  { id: 'top-7', name: 'Caramel Sauce Drizzle', price: 25 },
  { id: 'top-8', name: 'Rainbow Sprinkles', price: 15 },
];

async function main() {
  console.log('🐼 Starting  MySQL Database Seeding...');

  // 1. Seed Waffle Bases
  console.log('Seeding Waffle Bases...');
  for (const base of DEFAULT_WAFFLE_BASES) {
    await prisma.waffleBase.upsert({
      where: { id: base.id },
      update: {
        name: base.name,
        description: base.description,
        price: base.price,
        icon: base.icon,
      },
      create: {
        id: base.id,
        name: base.name,
        description: base.description,
        price: base.price,
        icon: base.icon,
      },
    });
  }

  // 2. Seed Toppings
  console.log('Seeding Toppings...');
  for (const topping of DEFAULT_TOPPINGS) {
    await prisma.topping.upsert({
      where: { id: topping.id },
      update: {
        name: topping.name,
        price: topping.price,
      },
      create: {
        id: topping.id,
        name: topping.name,
        price: topping.price,
      },
    });
  }

  // 3. Seed Menu Items
  console.log(`Seeding ${ALL_MENU_ITEMS.length} Menu Items...`);
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

  console.log(`✨ Successfully seeded ${count} products into  MySQL Database! 🐼🎉`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
