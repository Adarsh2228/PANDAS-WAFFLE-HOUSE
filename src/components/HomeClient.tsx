'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Header from './Header';
import HeroBanner from './HeroBanner';
import CategoryFilter from './CategoryFilter';
import MenuSection from './MenuSection';
import ItemDetailModal from './ItemDetailModal';
import WaffleBuilderModal from './WaffleBuilderModal';
import CartDrawer from './CartDrawer';
import PandaChefModal from './PandaChefModal';
import OrdersModal from './OrdersModal';
import SplashScreen from './SplashScreen';
import StatusRow from './StatusRow';
import LiveOffersSection from './LiveOffersSection';

import { CATEGORY_CONFIG } from '@/data/menuData';
import { MenuItemData, useStore } from '@/store/useStore';

interface HomeClientProps {
  initialMenuItems?: MenuItemData[];
}

// Dynamic floating pandas that randomly appear and disappear with sparkles
const PANDA_SLOTS = [
  { id: 'tl', style: { left: '20px', top: '25%' }, type: 'float', extra: '🎋' },
  { id: 'tr', style: { right: '40px', top: '35%' }, type: 'wave' },
  { id: 'bl', style: { left: '30px', bottom: '33%' }, type: 'bounce' },
  { id: 'br', style: { right: '20px', bottom: '20%' }, type: 'float' },
];

function FloatingPandas() {
  const [activeIds, setActiveIds] = useState<string[]>(['tl', 'br']);

  useEffect(() => {
    // Randomly toggle pandas every 4 seconds
    const interval = setInterval(() => {
      setActiveIds(prev => {
        const randomSlot = PANDA_SLOTS[Math.floor(Math.random() * PANDA_SLOTS.length)].id;
        if (prev.includes(randomSlot)) {
          return prev.length > 1 ? prev.filter(id => id !== randomSlot) : prev;
        } else {
          return [...prev, randomSlot];
        }
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 hidden xl:block">
      <AnimatePresence>
        {PANDA_SLOTS.map(slot => {
          if (!activeIds.includes(slot.id)) return null;
          return (
            <motion.div
              key={slot.id}
              initial={{ scale: 0, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 45 }}
              transition={{ type: 'spring', bounce: 0.6, duration: 1 }}
              className="absolute"
              style={slot.style}
            >
              {/* The Panda */}
              <div className={`text-[64px] panda-${slot.type}`} style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>🐼</div>
              
              {/* Extra Bamboo */}
              {slot.extra && (
                 <div className="text-3xl text-green-600 absolute -bottom-2 -right-2 panda-float-slow" style={{ animationDelay: '0.3s' }}>
                   {slot.extra}
                 </div>
              )}
              
              {/* Sparkling effect strictly on enter! */}
              <motion.div
                initial={{ opacity: 1, scale: 0.5 }}
                animate={{ opacity: 0, scale: 2 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="absolute text-yellow-400 text-2xl" style={{ top: -20, right: -10 }}>✨</div>
                <div className="absolute text-yellow-400 text-xl" style={{ bottom: -10, left: -20 }}>✨</div>
                <div className="absolute text-yellow-400 text-3xl" style={{ top: -10, left: -10 }}>⭐</div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Section anchor scroll helper
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function HomeClient({ initialMenuItems }: HomeClientProps) {
  const [showSplash, setShowSplash]     = useState(true);
  const [searchQuery, setSearchQuery]   = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [selectedDetailItem,    setSelectedDetailItem]    = useState<MenuItemData | null>(null);
  const [selectedCustomizeItem, setSelectedCustomizeItem] = useState<MenuItemData | null>(null);

  const { setIsPandaChefOpen, menuItems, setMenuItems, setProductVisibility } = useStore();

  // Sync initialMenuItems from server render
  useEffect(() => {
    if (initialMenuItems !== undefined) {
      setMenuItems(initialMenuItems);
      const vis: Record<string, boolean> = {};
      initialMenuItems.forEach((item) => {
        vis[item.id] = true;
      });
      setProductVisibility(vis);
    }
  }, [initialMenuItems]);

  // Live fetch from DB on mount and window focus
  useEffect(() => {
    const fetchActiveProducts = () => {
      fetch('/api/products', { cache: 'no-store' })
        .then((r) => r.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            setMenuItems(json.data);
            const vis: Record<string, boolean> = {};
            json.data.forEach((item: MenuItemData) => {
              vis[item.id] = true;
            });
            setProductVisibility(vis);
          }
        })
        .catch(() => {});
    };

    fetchActiveProducts();
    window.addEventListener('focus', fetchActiveProducts);
    return () => window.removeEventListener('focus', fetchActiveProducts);
  }, []);

  const menuCategories = useMemo(() => {
    // menuItems contains only active enabled products from DB
    const activeList = menuItems || [];
    
    return [
      { key: 'Sandwich Waffle', items: activeList.filter(i => i.category === 'Sandwich Waffle'), pandaSide: 'left' as const },
      { key: 'Belgium Waffle',  items: activeList.filter(i => i.category === 'Belgium Waffle'),  pandaSide: 'right' as const },
      { key: 'Bowl Cake',       items: activeList.filter(i => i.category === 'Bowl Cake'),       pandaSide: 'left' as const },
      { key: 'Pan Cake',        items: activeList.filter(i => i.category === 'Pan Cake'),        pandaSide: 'right' as const },
    ];
  }, [menuItems]);

  // Category filter selection → scroll to section
  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    if (cat !== 'All') {
      const id = `section-${cat.replace(/\s+/g, '-').toLowerCase()}`;
      setTimeout(() => scrollToSection(id), 80);
    }
  };

  // Filter menu categories for search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return menuCategories;
    const q = searchQuery.toLowerCase();
    return menuCategories.map(({ key, items, pandaSide }) => ({
      key,
      pandaSide,
      items: items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.subtitle?.toLowerCase().includes(q) ?? false)
      ),
    })).filter((c) => c.items.length > 0);
  }, [searchQuery, menuCategories]);

  const showMenuCats =
    activeCategory === 'All' ||
    ['Sandwich Waffle', 'Belgium Waffle', 'Bowl Cake', 'Pan Cake'].includes(activeCategory);


  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <div className="min-h-screen bg-[#fdf8f0] text-slate-900 font-sans pb-32 relative" id="home">
          {/* Bamboo background pattern */}
          <div className="fixed inset-0 pointer-events-none bamboo-pattern opacity-60" />

          {/* Floating panda mascots */}
          <FloatingPandas />

          {/* Header */}
          <Header />

          {/* WhatsApp-like Status / Stories Row */}
          <div className="relative z-20">
            <StatusRow />
          </div>

          {/* Live Offers from Master Portal */}
          <div className="relative z-10">
            <LiveOffersSection />
          </div>

          {/* Main Body */}
          <main id="menu" className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-6 space-y-8 sm:space-y-12 relative z-10">
            {/* Hero Banner with Search Bar */}
            <HeroBanner searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {/* Category Filter Pills (rendered only once, below HeroBanner) */}
            <CategoryFilter activeCategory={activeCategory} setActiveCategory={handleCategorySelect} />

            {/* ── MENU SECTIONS ─────────────────────────────────────── */}
            {searchQuery.trim() ? (
              /* Search Results */
              filteredCategories.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <span className="text-6xl inline-block">🔍🐼</span>
                  <h3 className="text-lg font-extrabold text-slate-800">No Waffles Found</h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Try searching for something else — like "chocolate", "oreo", "nutella" or "kunafa"!
                  </p>
                </div>
              ) : (
                filteredCategories.map(({ key, items, pandaSide }) => (
                  <MenuSection
                    key={key}
                    categoryName={key}
                    items={items}
                    config={CATEGORY_CONFIG[key]}
                    onOpenDetail={setSelectedDetailItem}
                    onOpenCustomize={setSelectedCustomizeItem}
                    pandaSide={pandaSide}
                  />
                ))
              )
            ) : (
              <>
                {/* Normal menu display filtered by active category */}
                {menuCategories.every((c) => c.items.length === 0) ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <span className="text-6xl inline-block panda-bounce">🐼🥞</span>
                    <h3 className="text-lg font-extrabold text-slate-800">No Waffles Available Right Now</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                      All products are currently disabled or being prepared. Check back shortly!
                    </p>
                  </div>
                ) : (
                  showMenuCats &&
                  menuCategories.filter(
                    ({ key, items }) => (activeCategory === 'All' || activeCategory === key) && items.length > 0
                  ).map(({ key, items, pandaSide }) => (
                    <MenuSection
                      key={key}
                      categoryName={key}
                      items={items}
                      config={CATEGORY_CONFIG[key]}
                      onOpenDetail={setSelectedDetailItem}
                      onOpenCustomize={setSelectedCustomizeItem}
                      pandaSide={pandaSide}
                    />
                  ))
                )}

                {/* Offers / Trends / Blogs are now separate pages via the header nav */}
              </>
            )}

            {/* Footer panda */}
            <div className="text-center py-10 space-y-3">
              <div className="text-5xl panda-bounce inline-block">🐼</div>
              <p className="text-sm text-slate-400 font-semibold">Made with ❤️ by Panda Chef Bam-Bam</p>
              <p className="text-xs text-slate-300 font-medium">© 2026 Pandas Waffle House · All rights reserved</p>
            </div>
          </main>

          {/* Floating Panda Chef Assistant Button */}
          <button
            id="panda-chef-btn"
            onClick={() => setIsPandaChefOpen(true)}
            className="fixed z-40 bg-emerald-800 hover:bg-emerald-900 text-white p-3 rounded-full shadow-2xl border-2 border-emerald-400 flex items-center gap-2 group active:scale-95 transition-all ripple-btn glow-amber"
            style={{
              bottom: 'max(96px, calc(env(safe-area-inset-bottom, 0px) + 96px))',
              left: '1.25rem',
              boxShadow: '0 0 0 0 rgba(52, 211, 153, 0.4)'
            }}
            aria-label="Open Panda Chef Assistant"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform panda-wave" style={{ display: 'inline-block' }}>🐼</span>
            <span className="text-xs font-black hidden sm:inline pr-1">Panda Chef</span>
          </button>

          {/* Modals & Slide-overs */}
          {selectedDetailItem && (
            <ItemDetailModal
              item={selectedDetailItem}
              onClose={() => setSelectedDetailItem(null)}
              onOpenCustomize={(item) => setSelectedCustomizeItem(item)}
            />
          )}

          {selectedCustomizeItem && (
            <WaffleBuilderModal
              item={selectedCustomizeItem}
              onClose={() => setSelectedCustomizeItem(null)}
            />
          )}

          <CartDrawer />
          <PandaChefModal />
          <OrdersModal />
        </div>
      )}
    </>
  );
}
