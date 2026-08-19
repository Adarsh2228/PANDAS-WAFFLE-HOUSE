import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ALL_MENU_ITEMS } from '@/data/menuData';

export interface WaffleBaseOption {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

export interface ToppingOption {
  id: string;
  name: string;
  price: number;
}

export interface BlogComment {
  id: string;
  user: string;
  text: string;
  date: string;
}

export interface Story {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  caption: string;
  createdAt: number;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  emoji: string;
  readTime: string;
  color: string;
  bgColor: string;
  imageUrl: string;
  date: string;
  enabled: boolean;
  instagramUrl?: string;
  expiresAt?: number; // timestamp
  comments?: BlogComment[];
}

export interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Offer {
  id: string;
  title: string;
  subtitle?: string;
  badge: string;
  badgeColor: string;
  imageUrl?: string;
  instagramUrl?: string;
  postType: 'instagram' | 'image' | 'url';
  gradient: string;
  ctaText: string;
  ctaUrl?: string;
  isEnabled: boolean;
  expiresAt?: number; // unix timestamp
  createdAt?: number;
}

export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category:
  | 'Sandwich Waffle'
  | 'Belgium Waffle'
  | 'Bowl Cake'
  | 'Pan Cake'
  | 'Trending Food'
  | 'Most Ordered'
  | 'Offers'
  | 'Waffle Bowls'
  | 'Cakes & Desserts';
  imageUrl: string;
  images?: string[];
  isEnabled?: boolean;
  isTrending?: boolean;
  isOffer?: boolean;
  rating: number;
  reviewCount: number;
  prepTime: string;
  reviews?: ReviewItem[];
  // Pricing variants
  priceSmall?: number;
  priceBig?: number;
  price5pc?: number;
  price10pc?: number;
  subtitle?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItemData;
  waffleBase: WaffleBaseOption;
  toppings: ToppingOption[];
  quantity: number;
  totalPrice: number;
}

// ─── DEFAULT WAFFLE BASES ────────────────────────────────────────────────────
export const DEFAULT_WAFFLE_BASES: WaffleBaseOption[] = [
  { id: 'base-1', name: 'Classic Golden Belgian Waffle', description: 'Crispy exterior, soft airy interior', price: 0, icon: '🧇' },
  { id: 'base-2', name: 'Double Chocolate Dark Waffle', description: 'Infused with 70% dark Belgian cocoa', price: 30, icon: '🍩' },
  { id: 'base-3', name: 'Crispy Golden Waffle Bowl', description: 'Bowl shape perfect for sauces and toppings', price: 25, icon: '🥣' },
  { id: 'base-4', name: 'Pan Cake Stack', description: 'Fluffy pancake stack ready for your toppings', price: 20, icon: '🥞' },
  { id: 'base-5', name: 'Sandwich Waffle', description: 'Two crispy waffle layers with filling inside', price: 15, icon: '🥪' },
];

// ─── DEFAULT TOPPINGS ────────────────────────────────────────────────────────
export const DEFAULT_TOPPINGS: ToppingOption[] = [
  { id: 'top-1', name: 'Warm Belgian Chocolate Drizzle', price: 30 },
  { id: 'top-2', name: 'Extra Nutella Spread', price: 40 },
  { id: 'top-3', name: 'Fresh Blueberries & Raspberries', price: 40 },
  { id: 'top-4', name: 'Crushed Oreos & KitKat', price: 25 },
  { id: 'top-5', name: 'Extra Whipped Cream', price: 20 },
  { id: 'top-6', name: 'Biscoff Spread', price: 35 },
  { id: 'top-7', name: 'Caramel Sauce Drizzle', price: 25 },
  { id: 'top-8', name: 'Rainbow Sprinkles', price: 15 },
];

// ─── DEFAULT BLOG POSTS ──────────────────────────────────────────────────────
const DEFAULT_BLOG_POSTS: BlogPost[] = [];

interface StoreState {
  // Cart
  cart: CartItem[];
  orderType: 'delivery' | 'pickup';
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  bambooPoints: number;
  isCartOpen: boolean;
  isOrdersOpen: boolean;
  isPandaChefOpen: boolean;
  tableNumber: string;
  ordersHistory: { id: string; date: string; items: CartItem[]; total: number; orderType: string; status?: 'pending' | 'completed' | 'cancelled' }[];
  isLoyaltyEnabled: boolean;
  masterPassword: string;

  // Master-managed customization
  menuItems: MenuItemData[];
  waffleBases: WaffleBaseOption[];
  extraToppings: ToppingOption[];
  blogPosts: BlogPost[];
  stories: Story[];
  offers: Offer[];
  productOrderCounts: Record<string, number>;   // productId → total orders
  productImages: Record<string, string[]>;       // productId → [imageUrl, ...]
  productVisibility: Record<string, boolean>;    // productId → visible?

  // Actions — Cart
  setOrderType: (type: 'delivery' | 'pickup') => void;
  setDeliveryAddress: (addr: string) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsOrdersOpen: (open: boolean) => void;
  setIsPandaChefOpen: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  addBambooPoints: (pts: number) => void;
  redeemBambooPoints: (pts: number) => void;
  setBambooPoints: (pts: number) => void;
  placeOrder: (order: { id: string; date: string; items: CartItem[]; total: number; orderType: string; status?: 'pending' | 'completed' | 'cancelled' }) => void;
  updateOrderStatus: (orderId: string, status: 'pending' | 'completed' | 'cancelled') => void;
  setIsLoyaltyEnabled: (enabled: boolean) => void;
  setTableNumber: (num: string) => void;
  setMasterPassword: (pwd: string) => void;

  // Actions — Master customization
  setMenuItems: (items: MenuItemData[]) => void;
  setWaffleBases: (bases: WaffleBaseOption[]) => void;
  setExtraToppings: (toppings: ToppingOption[]) => void;
  setBlogPosts: (posts: BlogPost[]) => void;
  setProductImages: (images: Record<string, string[]>) => void;
  setProductVisibility: (vis: Record<string, boolean>) => void;
  toggleBlogPost: (id: string) => void;
  setProductOrderCount: (productId: string, count: number) => void;
  updateMenuItem: (item: MenuItemData) => void;
  setStories: (stories: Story[]) => void;
  addStory: (story: Story) => void;
  deleteStory: (id: string) => void;
  setOffers: (offers: Offer[]) => void;
  addBlogComment: (postId: string, comment: BlogComment) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      orderType: 'delivery',
      deliveryAddress: '',
      customerName: '',
      customerPhone: '',
      bambooPoints: 0,
      isCartOpen: false,
      isOrdersOpen: false,
      isPandaChefOpen: false,
      tableNumber: '',
      ordersHistory: [],
      isLoyaltyEnabled: true,
      masterPassword: process.env.NEXT_PUBLIC_MASTER_PASSWORD || '',

      // Master state — defaults
      menuItems: ALL_MENU_ITEMS,
      waffleBases: DEFAULT_WAFFLE_BASES,
      extraToppings: DEFAULT_TOPPINGS,
      blogPosts: DEFAULT_BLOG_POSTS,
      stories: [],
      offers: [],
      productOrderCounts: {},
      productImages: {},
      productVisibility: {},

      // Cart actions
      setOrderType: (orderType) => set({ orderType }),
      setDeliveryAddress: (deliveryAddress) => set({ deliveryAddress }),
      setCustomerName: (customerName) => set({ customerName }),
      setCustomerPhone: (customerPhone) => set({ customerPhone }),
      setIsCartOpen: (isCartOpen) => set({ isCartOpen }),
      setIsOrdersOpen: (isOrdersOpen) => set({ isOrdersOpen }),
      setIsPandaChefOpen: (isPandaChefOpen) => set({ isPandaChefOpen }),
      setIsLoyaltyEnabled: (enabled) => set({ isLoyaltyEnabled: enabled }),
      setTableNumber: (tableNumber) => set({ tableNumber }),
      setMasterPassword: (pwd) => set({ masterPassword: pwd }),

      addToCart: (item) =>
        set((state) => ({ cart: [...state.cart, item], isCartOpen: true })),

      updateQuantity: (cartItemId, delta) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.cartItemId === cartItemId) {
              const newQty = Math.max(1, item.quantity + delta);
              const unitPrice = item.totalPrice / item.quantity;
              return { ...item, quantity: newQty, totalPrice: unitPrice * newQty };
            }
            return item;
          }),
        })),

      removeFromCart: (cartItemId) =>
        set((state) => ({ cart: state.cart.filter((i) => i.cartItemId !== cartItemId) })),

      clearCart: () => set({ cart: [] }),

      addBambooPoints: (pts) =>
        set((state) => ({ bambooPoints: state.bambooPoints + pts })),

      redeemBambooPoints: (pts) =>
        set((state) => ({ bambooPoints: Math.max(0, state.bambooPoints - pts) })),

      setBambooPoints: (pts) => set({ bambooPoints: pts }),

      placeOrder: (order) =>
        set((state) => {
          // Increment order counts for each product in the order
          const newCounts = { ...state.productOrderCounts };
          order.items.forEach((cartItem) => {
            const pid = cartItem.menuItem.id;
            newCounts[pid] = (newCounts[pid] ?? 0) + cartItem.quantity;
          });
          return {
            ordersHistory: [{ ...order, status: order.status || 'pending' }, ...state.ordersHistory],
            cart: [],
            productOrderCounts: newCounts,
          };
        }),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          ordersHistory: state.ordersHistory.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        })),

      // Master actions
      setMenuItems: (menuItems) => set({ menuItems }),
      setWaffleBases: (waffleBases) => set({ waffleBases }),
      setExtraToppings: (extraToppings) => set({ extraToppings }),
      setBlogPosts: (blogPosts) => set({ blogPosts }),
      setProductImages: (productImages) => set({ productImages }),
      setProductVisibility: (productVisibility) => set({ productVisibility }),

      toggleBlogPost: (id) =>
        set((state) => ({
          blogPosts: state.blogPosts.map((p) =>
            p.id === id ? { ...p, enabled: !p.enabled } : p
          ),
        })),

      setProductOrderCount: (productId, count) =>
        set((state) => ({
          productOrderCounts: { ...state.productOrderCounts, [productId]: count },
        })),

      updateMenuItem: (updatedItem) =>
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
        })),

      setStories: (stories) => set({ stories }),

      addStory: (story) =>
        set((state) => ({ stories: [...state.stories, story] })),

      deleteStory: (id) =>
        set((state) => ({ stories: state.stories.filter((s) => s.id !== id) })),

      setOffers: (offers) => set({ offers }),

      addBlogComment: (postId, comment) =>
        set((state) => ({
          blogPosts: state.blogPosts.map((p) =>
            p.id === postId
              ? { ...p, comments: [...(p.comments || []), comment] }
              : p
          ),
        })),
    }),
    {
      name: 'panda-waffles-cart-v3',
      partialize: (state) => ({
        cart: state.cart,
        ordersHistory: state.ordersHistory,
        bambooPoints: state.bambooPoints,
        orderType: state.orderType,
        deliveryAddress: state.deliveryAddress,
        customerName: state.customerName,
        customerPhone: state.customerPhone,
        tableNumber: state.tableNumber,
        productOrderCounts: state.productOrderCounts,
      }),
    }
  )
);
