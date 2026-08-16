// Re-export from new menuData for backward compatibility
export { ALL_MENU_ITEMS as MOCK_MENU_ITEMS } from './menuData';

import { MenuItemData, WaffleBaseOption, ToppingOption } from '@/store/useStore';

export const WAFFLE_BASES: WaffleBaseOption[] = [
  {
    id: 'base-1',
    name: 'Classic Golden Belgian Waffle',
    description: 'Crispy exterior, soft airy interior',
    price: 0,
    icon: '🧇'
  },
  {
    id: 'base-2',
    name: 'Double Chocolate Dark Waffle',
    description: 'Infused with 70% dark Belgian cocoa',
    price: 30,
    icon: '🍩'
  },
  {
    id: 'base-3',
    name: 'Crispy Golden Waffle Bowl',
    description: 'Bowl shape perfect for sauces and toppings',
    price: 25,
    icon: '🥣'
  },
  {
    id: 'base-4',
    name: 'Pan Cake Stack',
    description: 'Fluffy pancake stack ready for your toppings',
    price: 20,
    icon: '🥞'
  },
  {
    id: 'base-5',
    name: 'Sandwich Waffle',
    description: 'Two crispy waffle layers with filling inside',
    price: 15,
    icon: '🥪'
  }
];

export const EXTRA_TOPPINGS: ToppingOption[] = [
  { id: 'top-1', name: 'Warm Belgian Chocolate Drizzle', price: 30 },
  { id: 'top-2', name: 'Extra Nutella Spread', price: 40 },
  { id: 'top-3', name: 'Fresh Blueberries & Raspberries', price: 40 },
  { id: 'top-4', name: 'Crushed Oreos & KitKat', price: 25 },
  { id: 'top-5', name: 'Extra Whipped Cream', price: 20 },
  { id: 'top-6', name: 'Biscoff Spread', price: 35 },
  { id: 'top-7', name: 'Caramel Sauce Drizzle', price: 25 },
  { id: 'top-8', name: 'Rainbow Sprinkles', price: 15 },
];
