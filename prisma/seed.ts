import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.review.deleteMany();
  await prisma.topping.deleteMany();
  await prisma.menuItem.deleteMany();

  const toppings = await Promise.all([
    prisma.topping.create({ data: { name: 'Extra Chocolate Syrup', price: 20 } }),
    prisma.topping.create({ data: { name: 'Fresh Strawberries', price: 30 } }),
    prisma.topping.create({ data: { name: 'Whipped Cream', price: 15 } }),
    prisma.topping.create({ data: { name: 'Caramel Drizzle', price: 20 } }),
    prisma.topping.create({ data: { name: 'Crushed Oreos', price: 25 } }),
  ]);

  const items = await Promise.all([
    prisma.menuItem.create({
      data: {
        name: 'Classic Baby Panda Waffle',
        description: 'Our signature fluffy waffle shaped like a panda, served with a side of maple syrup.',
        basePrice: 120,
        category: 'Most Ordered',
        imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f9cbc?auto=format&fit=crop&q=80&w=800',
        isTrending: true,
        reviews: {
          create: [
            { rating: 5, comment: 'Absolutely adorable and delicious!' },
            { rating: 4, comment: 'A bit too sweet for me but kids loved it.' }
          ]
        }
      }
    }),
    prisma.menuItem.create({
      data: {
        name: 'Bamboo Matcha Delight',
        description: 'Green matcha infused waffle bowl filled with vanilla ice cream and red beans.',
        basePrice: 180,
        category: 'Trending Food',
        imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800',
        isTrending: true,
        reviews: {
          create: [
            { rating: 5, comment: 'The matcha flavor is perfect.' }
          ]
        }
      }
    }),
    prisma.menuItem.create({
      data: {
        name: 'Choco-Bear Extreme',
        description: 'Triple chocolate waffle with chocolate chips, cocoa powder, and dark chocolate sauce.',
        basePrice: 160,
        category: 'Most Ordered',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800',
        isTrending: false,
      }
    }),
    prisma.menuItem.create({
      data: {
        name: 'Weekend Combo Offer',
        description: 'Two classic waffles plus two coffees for a special price.',
        basePrice: 299,
        category: 'Offers',
        imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=800',
        isTrending: false,
      }
    }),
  ]);

  console.log('Seeding complete! ✨🐼');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
