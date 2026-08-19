'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Upload, Trash2, Lock, CheckCircle, XCircle,
  ShieldCheck, Search, Plus, Pencil, Save, X, Grid3X3,
  Layers, Sparkles, BookOpen, ToggleLeft, ToggleRight, GripVertical, ShoppingBag, Check, ImagePlus,
  Tag, Clock, ExternalLink
} from 'lucide-react';
import { ALL_MENU_ITEMS, CATEGORY_CONFIG } from '@/data/menuData';
import { MenuItemData, WaffleBaseOption, ToppingOption, BlogPost, Story, Offer, useStore } from '@/store/useStore';

// ─────────────────────────────────────────────────────────────────────────────
// Access Gate
// ─────────────────────────────────────────────────────────────────────────────
function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const masterPassword = useStore((state) => state.masterPassword) || process.env.NEXT_PUBLIC_MASTER_PASSWORD || '';
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === masterPassword && code !== '') {
      onUnlock();
    } else {
      setError(true); setShaking(true); setCode('');
      setTimeout(() => { setShaking(false); setError(false); }, 1500);
    }
  };

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg,#0F172A 0%,#1E293B 40%,#0F172A 100%)' }}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={i} className="fixed rounded-full bg-white pointer-events-none"
          style={{ width: 2 + (i % 3), height: 2 + (i % 3), left: `${(i * 17 + 5) % 95}%`, top: `${(i * 23 + 3) % 90}%` }}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <motion.div animate={shaking ? { x: [-12, 12, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-sm">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }} className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl" style={{ background: 'linear-gradient(135deg,#065F46,#059669)' }}>
            <Lock size={40} className="text-white" />
          </div>
        </motion.div>
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-white">🐼 Master Access</h1>
            <p className="text-slate-400 text-sm mt-1">Enter the special access code</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input ref={inputRef} type="password" value={code} onChange={(e) => setCode(e.target.value)}
                placeholder="Enter access code"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold tracking-widest focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                style={error ? { borderColor: '#EF4444', boxShadow: '0 0 0 2px rgba(239,68,68,0.25)' } : {}}
              />
            </div>
            {error && (
              <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs font-bold flex items-center gap-2">
                <XCircle size={13} /> Incorrect code. Access denied.
              </motion.p>
            )}
            <motion.button whileTap={{ scale: 0.96 }} type="submit" className="w-full text-white font-black py-3.5 rounded-2xl text-sm" style={{ background: 'linear-gradient(135deg,#065F46,#059669)' }}>
              Unlock Master Panel →
            </motion.button>
          </form>
          <p className="text-center text-slate-600 text-[11px] mt-6">This page is restricted. Unauthorized access is prohibited.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS TAB
// ─────────────────────────────────────────────────────────────────────────────
function ProductsTab() {
  const { menuItems, setMenuItems, updateMenuItem, productImages, setProductImages, productVisibility, setProductVisibility, productOrderCounts } = useStore();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newItemData, setNewItemData] = useState<Partial<MenuItemData>>({
    name: '',
    description: '',
    category: 'Sandwich Waffle',
    basePrice: 99,
    prepTime: '5-7 mins',
    imageUrl: '',
    images: [],
    isEnabled: true,
  });
  const [isSeeding, setIsSeeding] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const newProductFileRef = useRef<HTMLInputElement | null>(null);
  const CATS = ['All', 'Sandwich Waffle', 'Belgium Waffle', 'Bowl Cake', 'Pan Cake', 'Offers'];

  // Load products from DB on mount
  useEffect(() => {
    fetch('/api/products?all=true', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setMenuItems(json.data);
          // Sync visibility state directly from DB
          const visMap: Record<string, boolean> = {};
          const imgMap: Record<string, string[]> = {};
          json.data.forEach((p: MenuItemData) => {
            visMap[p.id] = p.isEnabled !== false;
            if (p.images && p.images.length > 0) {
              imgMap[p.id] = p.images;
            } else if (p.imageUrl) {
              imgMap[p.id] = [p.imageUrl];
            }
          });
          setProductVisibility(visMap);
          setProductImages(imgMap);
          setSyncStatus(' Database Synced');
        }
      })
      .catch((err) => {
        console.warn('Could not load products from API:', err);
      });
  }, []);

  const handleToggle = async (id: string) => {
    const current = menuItems.find((i) => i.id === id);
    const nextVal = current ? !current.isEnabled : !(productVisibility[id] ?? true);

    setProductVisibility({ ...productVisibility, [id]: nextVal });

    if (current) {
      updateMenuItem({ ...current, isEnabled: nextVal });
    }

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: nextVal }),
      });
      setSyncStatus(`Updated status for "${current?.name || 'product'}" to ${nextVal ? 'Enabled' : 'Disabled'}`);
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (e) {
      console.error('Failed to sync toggle to DB', e);
    }
  };

  const handleEnableAll = async () => {
    const newVis: Record<string, boolean> = {};
    const updated = menuItems.map((item) => {
      newVis[item.id] = true;
      return { ...item, isEnabled: true };
    });
    setProductVisibility(newVis);
    setMenuItems(updated);

    try {
      await fetch('/api/products/bulk-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: true }),
      });
      setSyncStatus('All products enabled in database');
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (e) {
      console.error('Failed to bulk enable', e);
    }
  };

  const handleDisableAll = async () => {
    const newVis: Record<string, boolean> = {};
    const updated = menuItems.map((item) => {
      newVis[item.id] = false;
      return { ...item, isEnabled: false };
    });
    setProductVisibility(newVis);
    setMenuItems(updated);

    try {
      await fetch('/api/products/bulk-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: false }),
      });
      setSyncStatus('All products disabled in database');
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (e) {
      console.error('Failed to bulk disable', e);
    }
  };

  const handleAddImages = async (id: string, files: FileList) => {
    const readers = Array.from(files).map((file) => new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = (e) => res(e.target?.result as string);
      r.readAsDataURL(file);
    }));

    const b64s = await Promise.all(readers);
    const updatedImages = [...(productImages[id] ?? []), ...b64s];
    setProductImages({ ...productImages, [id]: updatedImages });

    const current = menuItems.find((i) => i.id === id);
    if (current) {
      updateMenuItem({
        ...current,
        images: updatedImages,
        imageUrl: updatedImages[0] || current.imageUrl,
      });
    }

    // Sync to DB
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: updatedImages,
          imageUrl: updatedImages[0] || '',
        }),
      });
      setSyncStatus('Product image saved to database');
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (e) {
      console.error('Failed to save image to DB', e);
    }
  };

  const handleRemoveImage = async (id: string, idx: number) => {
    const imgs = (productImages[id] ?? []).filter((_, i) => i !== idx);
    setProductImages({ ...productImages, [id]: imgs });

    const current = menuItems.find((i) => i.id === id);
    if (current) {
      updateMenuItem({
        ...current,
        images: imgs,
        imageUrl: imgs[0] || '',
      });
    }

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: imgs,
          imageUrl: imgs[0] || '',
        }),
      });
    } catch (e) {
      console.error('Failed to update images on DB', e);
    }
  };

  const handleSaveItem = async (item: MenuItemData) => {
    updateMenuItem(item);
    setEditingItem(null);

    try {
      await fetch(`/api/products/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      setSyncStatus(`Saved "${item.name}" to DB`);
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (e) {
      console.error('Failed to save product details to DB', e);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSyncStatus('Seeding  database with all products...');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setSyncStatus(`✨ Successfully seeded ${json.count} products into !`);
        // Refresh products list
        const refreshed = await fetch('/api/products?all=true');
        const rJson = await refreshed.json();
        if (rJson.success) {
          setMenuItems(rJson.data);
        }
      } else {
        setSyncStatus(`❌ Seed failed: ${json.error || 'Check DB credentials'}`);
      }
    } catch (e: any) {
      setSyncStatus(`❌ Connection error: ${e.message}`);
    } finally {
      setIsSeeding(false);
      setTimeout(() => setSyncStatus(null), 6000);
    }
  };

  const handleCreateProduct = async () => {
    if (!newItemData.name || !newItemData.basePrice || !newItemData.category) {
      alert('Please provide name, base price, and category.');
      return;
    }

    const newProd: MenuItemData = {
      id: `prod-${Date.now()}`,
      name: newItemData.name,
      description: newItemData.description || '',
      basePrice: Number(newItemData.basePrice),
      category: newItemData.category as any,
      imageUrl: newItemData.imageUrl || (newItemData.images && newItemData.images[0]) || 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?auto=format&fit=crop&q=80&w=800',
      images: newItemData.images || [],
      isEnabled: true,
      rating: 0,
      reviewCount: 0,
      prepTime: newItemData.prepTime || '5-7 mins',
      priceSmall: newItemData.priceSmall,
      priceBig: newItemData.priceBig,
      price5pc: newItemData.price5pc,
      price10pc: newItemData.price10pc,
      subtitle: newItemData.subtitle,
    };

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
      setMenuItems([newProd, ...menuItems]);
      setIsNewProductOpen(false);
      setNewItemData({
        name: '',
        description: '',
        category: 'Sandwich Waffle',
        basePrice: 99,
        prepTime: '5-7 mins',
        imageUrl: '',
        images: [],
        isEnabled: true,
      });
      setSyncStatus(`Created "${newProd.name}" in database`);
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (e) {
      console.error('Failed to create product', e);
    }
  };

  const filtered = (menuItems || []).filter((item) => {
    const cat = filterCat === 'All' || item.category === filterCat;
    const srch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return cat && srch;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner with DB Sync Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">DATABASE Connected</span>
          {syncStatus && (
            <span className="text-xs font-bold text-amber-300 ml-2 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30">
              {syncStatus}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewProductOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all active:scale-95"
          >
            <Plus size={14} /> Add New Product
          </button>
          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles size={14} className={isSeeding ? 'animate-spin' : ''} />
            {isSeeding ? 'Seeding DB...' : 'Sync / Seed All Products'}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {CATS.map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)} className="shrink-0 text-xs font-black px-3 py-2 rounded-xl border transition-all"
              style={filterCat === cat ? { background: '#065F46', color: 'white', borderColor: '#065F46' } : { background: 'white', color: '#374151', borderColor: '#E5E7EB' }}
            >{cat}</button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">{filtered.length} products</p>
        <div className="flex items-center gap-2">
          <button onClick={handleEnableAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition-all bg-[#ECFDF5] text-[#065F46] border border-[#BBF7D0] hover:bg-[#D1FAE5]">
            <Eye size={12} /> Enable All
          </button>
          <button onClick={handleDisableAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition-all bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] hover:bg-[#FEE2E2]">
            <EyeOff size={12} /> Disable All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const isVisible = productVisibility[item.id] ?? (item.isEnabled !== false);
          const imgs = productImages[item.id] ?? (item.images && item.images.length > 0 ? item.images : [item.imageUrl]);
          const config = CATEGORY_CONFIG[item.category];
          const displayName = item.name.replace(/Sandwich Waffle$|Belgium Waffle$|Bowl Cake$|Pan Cake$/, '').trim();

          return (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" style={!isVisible ? { opacity: 0.55 } : {}}>
              <div className="h-1" style={{ background: `linear-gradient(90deg,${config?.color ?? '#94A3B8'},${config?.color ?? '#94A3B8'}44)` }} />
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white" style={{ background: config?.color ?? '#64748B' }}>{item.category}</span>
                    <h3 className="font-black text-slate-900 text-sm mt-1 leading-snug">{displayName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-400">
                        {item.priceSmall ? `Small ₹${item.priceSmall} / Big ₹${item.priceBig}` :
                          item.price5pc ? `5pc ₹${item.price5pc} / 10pc ₹${item.price10pc}` :
                            `₹${item.basePrice}`}
                      </p>
                      <span className="flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded-md">
                        <ShoppingBag size={10} /> {productOrderCounts[item.id] ?? 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleToggle(item.id)}
                      className="flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border transition-all"
                      style={isVisible ? { background: '#ECFDF5', color: '#065F46', borderColor: '#BBF7D0' } : { background: '#FEF2F2', color: '#B91C1C', borderColor: '#FECACA' }}
                    >
                      {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                      {isVisible ? 'Enabled' : 'Disabled'}
                    </motion.button>
                    <button onClick={() => setEditingItem({ ...item })}
                      className="flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all border border-slate-200"
                    >
                      <Pencil size={11} /> Edit Details
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Images ({imgs.length})</p>
                  <div className="flex gap-2 flex-wrap">
                    {imgs.map((src, i) => (
                      <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => handleRemoveImage(item.id, i)} className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={14} className="text-white" />
                        </button>
                        {i === 0 && <div className="absolute bottom-0.5 left-0.5 bg-emerald-600 text-white text-[7px] font-black px-1 py-0.5 rounded-full">Main</div>}
                      </div>
                    ))}
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => fileRefs.current[item.id]?.click()}
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 flex flex-col items-center justify-center gap-1 transition-colors bg-slate-50 hover:bg-emerald-50"
                    >
                      <Upload size={14} className="text-slate-400" />
                      <span className="text-[8px] font-bold text-slate-400">Add</span>
                    </motion.button>
                    <input ref={(el) => { fileRefs.current[item.id] = el; }} type="file" accept="image/*" multiple className="hidden"
                      onChange={(e) => { if (e.target.files) handleAddImages(item.id, e.target.files); e.target.value = ''; }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editingItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 my-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-base">Edit Product Details</h3>
                <button onClick={() => setEditingItem(null)} className="p-2 rounded-full hover:bg-slate-100"><X size={16} /></button>
              </div>

              {[
                { label: 'Name', field: 'name' as keyof MenuItemData },
                { label: 'Description', field: 'description' as keyof MenuItemData },
                { label: 'Prep Time', field: 'prepTime' as keyof MenuItemData },
                { label: 'Subtitle / Notes', field: 'subtitle' as keyof MenuItemData },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="text-xs font-black text-slate-600 block mb-1">{label}</label>
                  <input value={editingItem[field] as string || ''} onChange={(e) => setEditingItem({ ...editingItem, [field]: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Base Price', field: 'basePrice' as keyof MenuItemData },
                  { label: 'Price Small', field: 'priceSmall' as keyof MenuItemData },
                  { label: 'Price Big', field: 'priceBig' as keyof MenuItemData },
                  { label: 'Price 5pc', field: 'price5pc' as keyof MenuItemData },
                  { label: 'Price 10pc', field: 'price10pc' as keyof MenuItemData },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="text-xs font-black text-slate-600 block mb-1">{label}</label>
                    <input type="number" min={0} value={editingItem[field] as number || ''} onChange={(e) => setEditingItem({ ...editingItem, [field]: Number(e.target.value) || undefined })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2 mt-4">
                <button onClick={() => setEditingItem(null)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600">Cancel</button>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => handleSaveItem(editingItem)} className="flex-1 py-3 rounded-xl text-white font-black text-sm" style={{ background: 'linear-gradient(135deg,#065F46,#059669)' }}>
                  <Save size={14} className="inline mr-1" /> Save to Database
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Product modal */}
      <AnimatePresence>
        {isNewProductOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 my-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-base">Add New Product</h3>
                <button onClick={() => setIsNewProductOpen(false)} className="p-2 rounded-full hover:bg-slate-100"><X size={16} /></button>
              </div>

              <div>
                <label className="text-xs font-black text-slate-600 block mb-1">Product Name</label>
                <input value={newItemData.name || ''} onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                  placeholder="e.g. Hazelnut Choco Delight"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
              </div>

              <div>
                <label className="text-xs font-black text-slate-600 block mb-1">Category</label>
                <select
                  value={newItemData.category}
                  onChange={(e) => setNewItemData({ ...newItemData, category: e.target.value as any })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white"
                >
                  <option value="Sandwich Waffle">Sandwich Waffle</option>
                  <option value="Belgium Waffle">Belgium Waffle</option>
                  <option value="Bowl Cake">Bowl Cake</option>
                  <option value="Pan Cake">Pan Cake</option>
                  <option value="Offers">Offers</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-600 block mb-1">Description</label>
                <textarea rows={2} value={newItemData.description || ''} onChange={(e) => setNewItemData({ ...newItemData, description: e.target.value })}
                  placeholder="Warm waffle with chocolate filling..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-slate-600 block mb-1">Base Price (₹)</label>
                  <input type="number" min={0} value={newItemData.basePrice || ''} onChange={(e) => setNewItemData({ ...newItemData, basePrice: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-600 block mb-1">Prep Time</label>
                  <input value={newItemData.prepTime || '5-7 mins'} onChange={(e) => setNewItemData({ ...newItemData, prepTime: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-600 block mb-1">Image URL or Upload</label>
                <div className="flex gap-2">
                  <input value={newItemData.imageUrl || ''} onChange={(e) => setNewItemData({ ...newItemData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-400" />
                  <button type="button" onClick={() => newProductFileRef.current?.click()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 text-slate-700">
                    <Upload size={13} /> Upload
                  </button>
                  <input ref={newProductFileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const r = new FileReader();
                        r.onload = (ev) => {
                          const b64 = ev.target?.result as string;
                          setNewItemData({ ...newItemData, imageUrl: b64, images: [b64] });
                        };
                        r.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2 mt-4">
                <button onClick={() => setIsNewProductOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600">Cancel</button>
                <motion.button whileTap={{ scale: 0.96 }} onClick={handleCreateProduct} className="flex-1 py-3 rounded-xl text-white font-black text-sm" style={{ background: 'linear-gradient(135deg,#065F46,#059669)' }}>
                  <Plus size={14} className="inline mr-1" /> Create Product
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WAFFLE BASES TAB
// ─────────────────────────────────────────────────────────────────────────────
function WaffleBasesTab() {
  const { waffleBases, setWaffleBases } = useStore();
  const [editing, setEditing] = useState<WaffleBaseOption | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const blank: WaffleBaseOption = { id: '', name: '', description: '', price: 0, icon: '🧇' };

  useEffect(() => {
    fetch('/api/bases', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setWaffleBases(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleSave = async (base: WaffleBaseOption) => {
    if (isNew) {
      try {
        const res = await fetch('/api/bases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(base),
        });
        const json = await res.json();
        if (json.success) {
          setWaffleBases([...waffleBases, json.data]);
          showStatus('✨ Waffle base created and saved to DB!');
        }
      } catch {
        showStatus('Failed to create waffle base');
      }
    } else {
      setWaffleBases(waffleBases.map((b) => (b.id === base.id ? base : b)));
      try {
        await fetch(`/api/bases/${base.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(base),
        });
        showStatus('Waffle base updated in DB');
      } catch {
        showStatus('Failed to update waffle base');
      }
    }
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this waffle base?')) return;
    setWaffleBases(waffleBases.filter((b) => b.id !== id));
    try {
      await fetch(`/api/bases/${id}`, { method: 'DELETE' });
      showStatus('Waffle base deleted from DB');
    } catch {
      showStatus('Failed to delete waffle base');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold text-slate-500">{waffleBases.length} waffle bases in database</p>
          {statusMsg && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
              {statusMsg}
            </span>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditing({ ...blank });
            setIsNew(true);
          }}
          className="flex items-center gap-2 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-sm"
          style={{ background: 'linear-gradient(135deg,#065F46,#059669)' }}
        >
          <Plus size={14} /> Add New Base
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {waffleBases.map((base) => (
          <div key={base.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start gap-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl flex-shrink-0">{base.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-black text-slate-900 text-sm leading-snug">{base.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{base.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-sm text-slate-900">{base.price === 0 ? 'FREE' : `+₹${base.price}`}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setEditing({ ...base }); setIsNew(false); }} className="flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                  <Pencil size={11} /> Edit
                </button>
                <button onClick={() => handleDelete(base.id)} className="flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-base">{isNew ? 'Add Waffle Base' : 'Edit Waffle Base'}</h3>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-2 rounded-full hover:bg-slate-100"><X size={16} /></button>
              </div>
              <div className="flex gap-3">
                <div className="w-16">
                  <label className="text-xs font-black text-slate-600 block mb-1">Emoji</label>
                  <input value={editing.icon || '🧇'} onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                    className="w-full text-center text-xl border border-slate-200 rounded-xl py-2 focus:outline-none focus:border-emerald-400" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-black text-slate-600 block mb-1">Name</label>
                  <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-600 block mb-1">Description</label>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-600 block mb-1">Extra Price (₹)</label>
                <input type="number" min={0} value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600">Cancel</button>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => handleSave(editing)} className="flex-1 py-3 rounded-xl text-white font-black text-sm" style={{ background: 'linear-gradient(135deg,#065F46,#059669)' }}>
                  <Save size={14} className="inline mr-1" /> Save to DB
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPPINGS TAB
// ─────────────────────────────────────────────────────────────────────────────
function ToppingsTab() {
  const { extraToppings, setExtraToppings } = useStore();
  const [editing, setEditing] = useState<ToppingOption | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const blank: ToppingOption = { id: '', name: '', price: 0 };

  useEffect(() => {
    fetch('/api/toppings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setExtraToppings(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleSave = async (top: ToppingOption) => {
    if (isNew) {
      try {
        const res = await fetch('/api/toppings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(top),
        });
        const json = await res.json();
        if (json.success) {
          setExtraToppings([...extraToppings, json.data]);
          showStatus('✨ Topping created and saved to DB!');
        }
      } catch {
        showStatus('Failed to create topping');
      }
    } else {
      setExtraToppings(extraToppings.map((t) => (t.id === top.id ? top : t)));
      try {
        await fetch(`/api/toppings/${top.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(top),
        });
        showStatus('Topping updated in DB');
      } catch {
        showStatus('Failed to update topping');
      }
    }
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this topping?')) return;
    setExtraToppings(extraToppings.filter((t) => t.id !== id));
    try {
      await fetch(`/api/toppings/${id}`, { method: 'DELETE' });
      showStatus('Topping deleted from DB');
    } catch {
      showStatus('Failed to delete topping');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold text-slate-500">{extraToppings.length} toppings in database</p>
          {statusMsg && (
            <span className="text-xs font-bold text-violet-800 bg-violet-50 border border-violet-200 px-3 py-1 rounded-xl">
              {statusMsg}
            </span>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditing({ ...blank });
            setIsNew(true);
          }}
          className="flex items-center gap-2 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-sm"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)' }}
        >
          <Plus size={14} /> Add Topping
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {extraToppings.map((top, idx) => (
          <div key={top.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-sm font-black text-violet-600">✨</div>
              <div className="min-w-0">
                <h4 className="font-black text-slate-900 text-sm leading-snug line-clamp-1">{top.name}</h4>
                <p className="text-xs font-bold text-emerald-700">+₹{top.price}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setEditing({ ...top }); setIsNew(false); }} className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                <Pencil size={12} />
              </button>
              <button onClick={() => handleDelete(top.id)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-base">{isNew ? 'Add Topping' : 'Edit Topping'}</h3>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-2 rounded-full hover:bg-slate-100"><X size={16} /></button>
              </div>
              <div>
                <label className="text-xs font-black text-slate-600 block mb-1">Topping Name</label>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-600 block mb-1">Price (₹)</label>
                <input type="number" min={0} value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600">Cancel</button>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => handleSave(editing)} className="flex-1 py-3 rounded-xl text-white font-black text-sm" style={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)' }}>
                  <Save size={14} className="inline mr-1" /> Save to DB
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG POSTS TAB
// ─────────────────────────────────────────────────────────────────────────────
function BlogPostsTab() {
  const { blogPosts, setBlogPosts } = useStore();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expireAmount, setExpireAmount] = useState<number | ''>('');
  const [expireUnit, setExpireUnit] = useState<'hours' | 'days'>('days');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const editFileRef = useRef<HTMLInputElement | null>(null);
  const newFileRef = useRef<HTMLInputElement | null>(null);

  const [newBlog, setNewBlog] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    subtitle: '',
    category: 'Baking Secrets',
    emoji: '🧇',
    readTime: '3 min read',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f9cbc?auto=format&fit=crop&q=80&w=800',
    color: '#0D9488',
    content: '',
    instagramUrl: '',
    enabled: true,
  });

  // Load from DB on mount
  useEffect(() => {
    fetch('/api/blogs?all=true', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setBlogPosts(json.data);
        }
      })
      .catch(() => { });
  }, []);

  const enabledCount = blogPosts.filter((p) => p.enabled).length;

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleToggle = async (id: string) => {
    const current = blogPosts.find((p) => p.id === id);
    if (!current) return;
    const nextVal = !current.enabled;

    setBlogPosts(blogPosts.map((p) => (p.id === id ? { ...p, enabled: nextVal } : p)));

    try {
      await fetch(`/api/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextVal }),
      });
      showStatus(`Post "${current.title}" ${nextVal ? 'Published' : 'Drafted'}`);
    } catch {
      showStatus('Failed to update status on DB');
    }
  };

  const handleSave = async (post: BlogPost) => {
    let finalPost = { ...post };
    if (expireAmount && Number(expireAmount) > 0) {
      const multiplier = expireUnit === 'days' ? 24 * 3600 * 1000 : 3600 * 1000;
      finalPost.expiresAt = Date.now() + Number(expireAmount) * multiplier;
    } else {
      finalPost.expiresAt = undefined;
    }

    setBlogPosts(blogPosts.map((p) => (p.id === post.id ? finalPost : p)));
    setEditing(null);

    try {
      await fetch(`/api/blogs/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPost),
      });
      showStatus('Blog post updated in database');
    } catch {
      showStatus('Failed to update blog in database');
    }
  };

  const handleCreateBlog = async () => {
    if (!newBlog.title.trim()) {
      alert('Please enter a blog title');
      return;
    }

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog),
      });
      const json = await res.json();
      if (json.success) {
        setBlogPosts([json.data, ...blogPosts]);
        setIsCreating(false);
        setNewBlog({
          title: '',
          subtitle: '',
          category: 'Baking Secrets',
          emoji: '🧇',
          readTime: '3 min read',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f9cbc?auto=format&fit=crop&q=80&w=800',
          color: '#0D9488',
          content: '',
          instagramUrl: '',
          enabled: true,
        });
        showStatus('🎉 New blog post created and saved to database!');
      }
    } catch {
      showStatus('Failed to create blog post');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setBlogPosts(blogPosts.filter((p) => p.id !== id));
    try {
      await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      showStatus('Blog post deleted from database');
    } catch {
      showStatus('Failed to delete blog post from database');
    }
  };

  const handleEditImageUpload = (files: FileList) => {
    if (!editing || !files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditing({ ...editing, imageUrl: e.target?.result as string });
    };
    reader.readAsDataURL(files[0]);
  };

  const handleNewImageUpload = (files: FileList) => {
    if (!files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewBlog({ ...newBlog, imageUrl: e.target?.result as string });
    };
    reader.readAsDataURL(files[0]);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <p className="text-sm font-black text-slate-800">
            {enabledCount} of {blogPosts.length} posts published
          </p>
          <p className="text-xs text-slate-400">
            Toggle switches to publish/unpublish posts on the customer blog page
          </p>
        </div>

        <div className="flex items-center gap-3">
          {statusMsg && (
            <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl">
              {statusMsg}
            </span>
          )}

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-black text-xs shadow-md transition-all"
            style={{ background: 'linear-gradient(135deg,#0D9488,#0891B2)' }}
          >
            <Plus size={15} /> Add New Blog Post
          </motion.button>
        </div>
      </div>

      {/* Posts List */}
      {blogPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <span className="text-5xl inline-block">📝🐼</span>
          <h3 className="font-black text-slate-800 text-base">No Blog Posts Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the "Add New Blog Post" button above to publish your first story, recipe, or kitchen secret!
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-0">
                {/* Thumbnail */}
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden relative bg-slate-100">
                  <img src={post.imageUrl || 'https://images.unsplash.com/photo-1562376552-0d160a2f9cbc?auto=format&fit=crop&q=80&w=800'} alt={post.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 text-sm bg-black/40 backdrop-blur-sm rounded-md px-1">{post.emoji || '🧇'}</span>
                </div>

                {/* Info */}
                <div className="flex-1 px-4 py-3 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white" style={{ background: post.color || '#0D9488' }}>
                          {post.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{post.readTime}</span>
                        <span className="text-[10px] text-slate-400">• {post.date}</span>
                      </div>
                      <h4 className="font-black text-slate-900 text-sm mt-1 leading-snug line-clamp-1">{post.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{post.subtitle || post.content}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggle(post.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border transition-all"
                        style={post.enabled
                          ? { background: '#ECFDF5', color: '#065F46', borderColor: '#BBF7D0' }
                          : { background: '#F8FAFC', color: '#64748B', borderColor: '#E2E8F0' }
                        }
                      >
                        {post.enabled ? <ToggleRight size={14} className="text-emerald-600" /> : <ToggleLeft size={14} />}
                        {post.enabled ? 'Published' : 'Draft'}
                      </motion.button>

                      <button
                        onClick={() => { setEditing({ ...post }); setExpireAmount(''); setExpireUnit('days'); }}
                        className="flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                      >
                        <Pencil size={11} /> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 transition-all"
                        title="Delete Post"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="h-1" style={{ background: post.enabled ? (post.color || '#0D9488') : '#E2E8F0' }} />
            </div>
          ))}
        </div>
      )}

      {/* Add New Blog Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 my-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  <h3 className="font-black text-slate-900 text-lg">Create New Blog Post</h3>
                </div>
                <button onClick={() => setIsCreating(false)} className="p-2 rounded-full hover:bg-slate-100"><X size={16} /></button>
              </div>

              <div className="space-y-3 max-h-[68vh] overflow-y-auto pr-1">
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Post Title *</label>
                  <input
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    placeholder="e.g. Secrets to Our Signature Batter 🧇"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Subtitle / Short Summary</label>
                  <input
                    value={newBlog.subtitle || ''}
                    onChange={(e) => setNewBlog({ ...newBlog, subtitle: e.target.value })}
                    placeholder="Short catchphrase or overview..."
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Category</label>
                    <select
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 font-bold bg-white"
                    >
                      <option value="Baking Secrets">Baking Secrets</option>
                      <option value="Foodie Trends">Foodie Trends</option>
                      <option value="Our Story">Our Story</option>
                      <option value="Dessert Pairing">Dessert Pairing</option>
                      <option value="Offers & News">Offers & News</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Emoji Icon</label>
                    <input
                      value={newBlog.emoji || ''}
                      onChange={(e) => setNewBlog({ ...newBlog, emoji: e.target.value })}
                      placeholder="🧇"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Read Time</label>
                    <input
                      value={newBlog.readTime || ''}
                      onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })}
                      placeholder="3 min read"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">Badge Color (Hex)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newBlog.color || '#0D9488'}
                        onChange={(e) => setNewBlog({ ...newBlog, color: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                      />
                      <input
                        value={newBlog.color || '#0D9488'}
                        onChange={(e) => setNewBlog({ ...newBlog, color: e.target.value })}
                        className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload & Preview */}
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Cover Image</label>
                  <div className="flex items-center gap-3">
                    {newBlog.imageUrl && (
                      <img src={newBlog.imageUrl} alt="preview" className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0" />
                    )}
                    <div className="flex-1 space-y-1.5">
                      <input
                        value={newBlog.imageUrl}
                        onChange={(e) => setNewBlog({ ...newBlog, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/... or upload below"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
                      />
                      <input
                        ref={newFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files && handleNewImageUpload(e.target.files)}
                      />
                      <button
                        type="button"
                        onClick={() => newFileRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all"
                      >
                        <ImagePlus size={13} /> Upload Image from Computer
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Full Article Content</label>
                  <textarea
                    rows={4}
                    value={newBlog.content || ''}
                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                    placeholder="Write your story, ingredients, recipe, or announcement here..."
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Instagram Embed URL (Optional)</label>
                  <input
                    value={newBlog.instagramUrl || ''}
                    onChange={(e) => setNewBlog({ ...newBlog, instagramUrl: e.target.value })}
                    placeholder="https://www.instagram.com/p/..."
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleCreateBlog}
                  className="flex-1 py-3 rounded-xl text-white font-black text-sm shadow-md"
                  style={{ background: 'linear-gradient(135deg,#0D9488,#0891B2)' }}
                >
                  <Plus size={15} className="inline mr-1" /> Publish Post
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 my-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-900 text-lg">Edit Blog Post</h3>
                <button onClick={() => setEditing(null)} className="p-2 rounded-full hover:bg-slate-100"><X size={16} /></button>
              </div>

              <div className="space-y-3 max-h-[68vh] overflow-y-auto pr-1">
                {[
                  { label: 'Title', field: 'title' as keyof BlogPost },
                  { label: 'Subtitle', field: 'subtitle' as keyof BlogPost },
                  { label: 'Category', field: 'category' as keyof BlogPost },
                  { label: 'Emoji', field: 'emoji' as keyof BlogPost },
                  { label: 'Read Time', field: 'readTime' as keyof BlogPost },
                  { label: 'Date', field: 'date' as keyof BlogPost },
                  { label: 'Color (hex)', field: 'color' as keyof BlogPost },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="text-xs font-black text-slate-600 block mb-1">{label}</label>
                    <input
                      value={editing[field] as string || ''}
                      onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                ))}

                {/* Edit Cover Image */}
                <div>
                  <label className="text-xs font-black text-slate-600 block mb-1">Cover Image</label>
                  <div className="flex items-center gap-3">
                    {editing.imageUrl && (
                      <img src={editing.imageUrl} alt="preview" className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0" />
                    )}
                    <div className="flex-1 space-y-1.5">
                      <input
                        value={editing.imageUrl || ''}
                        onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                        placeholder="Image URL or upload"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-400"
                      />
                      <input
                        ref={editFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files && handleEditImageUpload(e.target.files)}
                      />
                      <button
                        type="button"
                        onClick={() => editFileRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all"
                      >
                        <ImagePlus size={13} /> Change Image
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-600 block mb-1">Full Article Content</label>
                  <textarea
                    rows={4}
                    value={editing.content || ''}
                    onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-600 block mb-1">Instagram Embed URL</label>
                  <input
                    value={editing.instagramUrl || ''}
                    onChange={(e) => setEditing({ ...editing, instagramUrl: e.target.value })}
                    placeholder="https://www.instagram.com/p/..."
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-600 block mb-1">Display Duration Timer</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={expireAmount}
                      onChange={(e) => setExpireAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="E.g. 3 (Leave empty for no expiry)"
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400"
                    />
                    <select
                      value={expireUnit}
                      onChange={(e) => setExpireUnit(e.target.value as 'hours' | 'days')}
                      className="w-24 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 bg-white"
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSave(editing)}
                  className="flex-1 py-3 rounded-xl text-white font-black text-sm shadow-md"
                  style={{ background: 'linear-gradient(135deg,#0D9488,#0891B2)' }}
                >
                  <Save size={14} className="inline mr-1" /> Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STORIES TAB
// ─────────────────────────────────────────────────────────────────────────────
function StoriesTab() {
  const { stories, setStories, addStory, deleteStory } = useStore();
  const [imageUrl, setImageUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const storyFileRef = useRef<HTMLInputElement | null>(null);

  // Load from DB on mount
  useEffect(() => {
    fetch('/api/stories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setStories(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handlePost = async () => {
    if (!imageUrl) return;
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          thumbnailUrl: thumbnailUrl || imageUrl,
          caption,
        }),
      });
      const json = await res.json();
      if (json.success) {
        addStory(json.data);
        setImageUrl('');
        setThumbnailUrl('');
        setCaption('');
        showStatus('✨ Story posted and saved to database!');
      }
    } catch {
      showStatus('Failed to save story to database');
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm('Delete this story?')) return;
    deleteStory(id);
    try {
      await fetch(`/api/stories/${id}`, { method: 'DELETE' });
      showStatus('Story deleted from database');
    } catch {
      showStatus('Failed to delete story');
    }
  };

  const handleImageUpload = (files: FileList) => {
    if (!files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(files[0]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <span className="text-xl">📸</span> Post New Story
          </h3>
          {statusMsg && (
            <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
              {statusMsg}
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-black text-slate-600 block mb-1">Story Image (Photo/Video)</label>
            <div className="flex items-center gap-3">
              {imageUrl && (
                <img src={imageUrl} alt="preview" className="w-16 h-20 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0" />
              )}
              <div className="flex-1 space-y-1.5">
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or upload photo from device"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  ref={storyFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => storyFileRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all"
                >
                  <ImagePlus size={13} /> Upload Image from Computer
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-600 block mb-1">Story Caption (Optional)</label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Fresh batch of Belgian waffles just came out of the iron! 🧇"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handlePost}
            disabled={!imageUrl}
            className="w-full py-3 rounded-xl text-white font-black text-sm disabled:opacity-50 shadow-md"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}
          >
            <Upload size={14} className="inline mr-1" /> Post Story to Storefront
          </motion.button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-900">Active Stories ({stories.length})</h3>
          <span className="text-xs text-slate-400 font-bold">Stored in TiDB Cloud</span>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-2">
            <span className="text-4xl inline-block">📸🐼</span>
            <p className="text-sm font-bold text-slate-700">No Stories Active Right Now</p>
            <p className="text-xs text-slate-400">Post a behind-the-scenes photo or waffle teaser above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {stories.map((story) => {
              const createdAt = story.createdAt ? Number(story.createdAt) : Date.now();
              const hrs = Math.max(0, Math.round((Date.now() - createdAt) / 3600000));
              return (
                <div key={story.id} className="relative aspect-[9/16] bg-slate-100 rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
                  <img src={story.imageUrl} alt="Story" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] text-white font-bold">
                    {hrs === 0 ? 'Just now' : `${hrs}h ago`}
                  </div>
                  <button
                    onClick={() => handleDeleteStory(story.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-all"
                    title="Delete Story"
                  >
                    <Trash2 size={12} />
                  </button>
                  {story.caption && (
                    <div className="absolute bottom-2 left-2 right-2 text-center text-white text-[10px] font-bold px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg line-clamp-2">
                      {story.caption}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS TAB
// ─────────────────────────────────────────────────────────────────────────────
function OrdersTab() {
  const { ordersHistory, updateOrderStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = ordersHistory.filter(o =>
    o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by Order ID (e.g. ORD-123)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all shadow-sm"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-white rounded-3xl border border-slate-100">
          <ShoppingBag size={48} className="mb-4 opacity-20" />
          <p className="font-bold text-sm">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
              {order.status === 'completed' && <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />}
              {order.status === 'cancelled' && <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />}
              {(!order.status || order.status === 'pending') && <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />}

              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-slate-900 text-lg">{order.id}</h3>
                    {order.status === 'completed' && <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-200">Completed</span>}
                    {order.status === 'cancelled' && <span className="bg-red-100 text-red-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-red-200">Cancelled</span>}
                    {(!order.status || order.status === 'pending') && <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-200">Pending</span>}
                  </div>
                  <p className="text-xs font-bold text-slate-400">{order.date} • {order.orderType}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-slate-400">Total Bill</p>
                  <p className="font-black text-emerald-600 text-xl">₹{order.total}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-start text-sm">
                    <div>
                      <span className="font-bold text-slate-700">{item.quantity}x {item.menuItem.name}</span>
                      <div className="text-xs text-slate-500 pl-4 mt-0.5">
                        • Base: {item.waffleBase.name}
                        {item.toppings.length > 0 && item.toppings.map((t, ti) => (
                          <div key={ti}>+ {t.name} (₹{t.price})</div>
                        ))}
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              {(!order.status || order.status === 'pending') && (
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={14} /> Mark Delivered
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={14} /> Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OFFERS TAB
// ─────────────────────────────────────────────────────────────────────────────
const PRESET_GRADIENTS = [
  { label: 'Emerald', value: '135deg,#065F46,#059669' },
  { label: 'Purple', value: '135deg,#4C1D95,#7C3AED' },
  { label: 'Rose', value: '135deg,#9F1239,#E11D48' },
  { label: 'Amber', value: '135deg,#92400E,#D97706' },
  { label: 'Ocean', value: '135deg,#0C4A6E,#0284C7' },
  { label: 'Sunset', value: '135deg,#7C2D12,#EA580C' },
  { label: 'Night', value: '135deg,#0F172A,#1E3A5F' },
  { label: 'Berry', value: '135deg,#4A044E,#A21CAF' },
];

const PRESET_BADGES = ['OFFER', '20% OFF', 'BOGO', 'FREE DELIVERY', 'COMBO DEAL', 'TODAY ONLY', 'LIMITED TIME', 'NEW'];

const PRESET_BADGE_COLORS = ['#059669', '#D97706', '#E11D48', '#7C3AED', '#0284C7', '#DC2626', '#B45309', '#0F766E'];

function OffersTab() {
  const { offers, setOffers } = useStore();
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const imageFileRef = useRef<HTMLInputElement | null>(null);
  const editImageRef = useRef<HTMLInputElement | null>(null);

  const BLANK_OFFER: Omit<Offer, 'id'> = {
    title: '',
    subtitle: '',
    badge: 'OFFER',
    badgeColor: '#059669',
    imageUrl: '',
    instagramUrl: '',
    postType: 'image',
    gradient: '135deg,#065F46,#059669',
    ctaText: 'Order Now',
    ctaUrl: '',
    isEnabled: true,
  };

  const [newOffer, setNewOffer] = useState<Omit<Offer, 'id'>>(BLANK_OFFER);
  const [expireAmount, setExpireAmount] = useState<number | ''>('');
  const [expireUnit, setExpireUnit] = useState<'hours' | 'days'>('hours');
  const [editExpireAmount, setEditExpireAmount] = useState<number | ''>('');
  const [editExpireUnit, setEditExpireUnit] = useState<'hours' | 'days'>('hours');

  const showStatus = (msg: string) => { setStatusMsg(msg); setTimeout(() => setStatusMsg(null), 3500); };

  // Load from DB on mount
  useEffect(() => {
    fetch('/api/offers', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => { if (json.success && Array.isArray(json.data)) setOffers(json.data); })
      .catch(() => {});
  }, []);

  const handleImageUpload = (files: FileList, target: 'new' | 'edit') => {
    const file = files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert('Image must be under 3 MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      if (target === 'new') setNewOffer((p) => ({ ...p, imageUrl: base64 }));
      else if (editing) setEditing((p) => p ? { ...p, imageUrl: base64 } : p);
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!newOffer.title.trim()) { alert('Please enter an offer title'); return; }
    let expiresAt: number | undefined;
    if (expireAmount && Number(expireAmount) > 0) {
      const ms = expireUnit === 'days' ? 24 * 3600 * 1000 : 3600 * 1000;
      expiresAt = Date.now() + Number(expireAmount) * ms;
    }
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newOffer, expiresAt }),
      });
      const json = await res.json();
      if (json.success) {
        setOffers([json.data, ...offers]);
        setNewOffer(BLANK_OFFER);
        setExpireAmount('');
        setIsCreating(false);
        showStatus('✅ Offer published to database!');
      } else { showStatus('❌ ' + json.error); }
    } catch { showStatus('❌ Failed to create offer'); }
  };

  const handleToggle = async (id: string) => {
    const current = offers.find((o) => o.id === id);
    if (!current) return;
    const nextVal = !current.isEnabled;
    setOffers(offers.map((o) => o.id === id ? { ...o, isEnabled: nextVal } : o));
    try {
      await fetch(`/api/offers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: nextVal }),
      });
      showStatus(`${nextVal ? '✅ Offer enabled' : '⏸️ Offer disabled'}: "${current.title}"`);
    } catch { showStatus('❌ Failed to update'); }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    let expiresAt: number | undefined;
    if (editExpireAmount && Number(editExpireAmount) > 0) {
      const ms = editExpireUnit === 'days' ? 24 * 3600 * 1000 : 3600 * 1000;
      expiresAt = Date.now() + Number(editExpireAmount) * ms;
    } else {
      expiresAt = editing.expiresAt;
    }
    const payload = { ...editing, expiresAt };
    try {
      const res = await fetch(`/api/offers/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setOffers(offers.map((o) => o.id === editing.id ? json.data : o));
        setEditing(null);
        showStatus('✅ Offer updated in database');
      } else { showStatus('❌ ' + json.error); }
    } catch { showStatus('❌ Failed to update offer'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offer permanently?')) return;
    try {
      await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      setOffers(offers.filter((o) => o.id !== id));
      showStatus('🗑️ Offer deleted');
    } catch { showStatus('❌ Failed to delete'); }
  };

  const enabledCount = offers.filter((o) => o.isEnabled).length;

  const OfferFormFields = ({
    data, onChange, fileRef, onFileUpload,
  }: {
    data: Partial<Offer>;
    onChange: (next: Partial<Offer>) => void;
    fileRef: React.RefObject<HTMLInputElement | null>;
    onFileUpload: (files: FileList) => void;
  }) => (
    <div className="space-y-4">
      {/* Post Type */}
      <div>
        <label className="text-xs font-black text-slate-600 block mb-2">Post Type</label>
        <div className="flex gap-2">
          {([['image', '🖼️ Image Upload'], ['url', '🔗 Image URL'], ['instagram', '📸 Instagram Link']] as [string, string][]).map(([type, label]) => (
            <button key={type} type="button"
              onClick={() => onChange({ ...data, postType: type as Offer['postType'] })}
              className="flex-1 py-2.5 rounded-xl text-xs font-black border transition-all"
              style={data.postType === type
                ? { background: 'linear-gradient(135deg,#065F46,#059669)', color: '#fff', border: '2px solid #059669' }
                : { background: '#F8FAFC', color: '#64748B', border: '1.5px solid #E2E8F0' }
              }
            >{label}</button>
          ))}
        </div>
      </div>

      {/* Image input based on type */}
      {data.postType === 'instagram' ? (
        <div>
          <label className="text-xs font-black text-slate-600 block mb-1">Instagram Post URL</label>
          <div className="relative">
            <Instagram size={14} className="absolute left-3 top-3.5 text-pink-500" />
            <input value={data.instagramUrl || ''}
              onChange={(e) => onChange({ ...data, instagramUrl: e.target.value })}
              placeholder="https://www.instagram.com/p/..."
              className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Only instagram.com links are accepted for security</p>
        </div>
      ) : data.postType === 'url' ? (
        <div>
          <label className="text-xs font-black text-slate-600 block mb-1">Image URL</label>
          <div className="flex items-center gap-2">
            {data.imageUrl && data.imageUrl.startsWith('http') && (
              <img src={data.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
            <input value={data.imageUrl || ''}
              onChange={(e) => onChange({ ...data, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="text-xs font-black text-slate-600 block mb-1">Upload Image (from device)</label>
          <div className="flex items-center gap-3">
            {data.imageUrl && (
              <img src={data.imageUrl} alt="preview" className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
            <div className="flex-1 space-y-1.5">
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files && onFileUpload(e.target.files)} />
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black transition-all w-full justify-center"
              >
                <ImagePlus size={14} /> Click to Upload Image (max 3 MB)
              </button>
              {data.imageUrl && !data.imageUrl.startsWith('http') && (
                <p className="text-[10px] text-emerald-600 font-bold">✅ Image uploaded (stored in DB)</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="text-xs font-black text-slate-600 block mb-1">Offer Title *</label>
        <input value={data.title || ''} onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="e.g. Buy 2 Get 1 Free on All Waffles!"
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 font-bold"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="text-xs font-black text-slate-600 block mb-1">Subtitle / Description</label>
        <textarea rows={2} value={data.subtitle || ''} onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
          placeholder="Add details about the offer..."
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none"
        />
      </div>

      {/* Badge */}
      <div>
        <label className="text-xs font-black text-slate-600 block mb-2">Offer Badge Label</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PRESET_BADGES.map((b) => (
            <button key={b} type="button" onClick={() => onChange({ ...data, badge: b })}
              className="px-2.5 py-1 rounded-full text-[10px] font-black transition-all"
              style={data.badge === b
                ? { background: data.badgeColor || '#059669', color: '#fff' }
                : { background: '#F1F5F9', color: '#64748B' }
              }
            >{b}</button>
          ))}
        </div>
        <input value={data.badge || ''} onChange={(e) => onChange({ ...data, badge: e.target.value })}
          placeholder="Custom badge text..."
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Badge Color */}
      <div>
        <label className="text-xs font-black text-slate-600 block mb-2">Badge Color</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_BADGE_COLORS.map((c) => (
            <button key={c} type="button" onClick={() => onChange({ ...data, badgeColor: c })}
              className="w-8 h-8 rounded-full border-2 transition-all shadow-sm"
              style={{ background: c, borderColor: data.badgeColor === c ? '#0F172A' : 'transparent', transform: data.badgeColor === c ? 'scale(1.2)' : 'scale(1)' }}
            />
          ))}
          <input type="color" value={data.badgeColor || '#059669'}
            onChange={(e) => onChange({ ...data, badgeColor: e.target.value })}
            className="w-8 h-8 rounded-full border border-slate-200 cursor-pointer"
            title="Custom color"
          />
        </div>
      </div>

      {/* Card Gradient */}
      <div>
        <label className="text-xs font-black text-slate-600 block mb-2">Card Background Gradient</label>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_GRADIENTS.map((g) => (
            <button key={g.value} type="button" onClick={() => onChange({ ...data, gradient: g.value })}
              className="h-10 rounded-xl text-[10px] font-black text-white transition-all shadow-sm"
              style={{
                background: `linear-gradient(${g.value})`,
                border: data.gradient === g.value ? '3px solid #0F172A' : '2px solid transparent',
                transform: data.gradient === g.value ? 'scale(1.05)' : 'scale(1)',
              }}
            >{g.label}</button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-black text-slate-600 block mb-1">Button Text</label>
          <input value={data.ctaText || 'Order Now'} onChange={(e) => onChange({ ...data, ctaText: e.target.value })}
            placeholder="Order Now"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div>
          <label className="text-xs font-black text-slate-600 block mb-1">Button URL (optional)</label>
          <input value={data.ctaUrl || ''} onChange={(e) => onChange({ ...data, ctaUrl: e.target.value })}
            placeholder="https://..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">🏷️ Offers &amp; Promotions</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {enabledCount} of {offers.length} offers active on storefront
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => { setIsCreating(true); setNewOffer(BLANK_OFFER); setExpireAmount(''); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-black text-sm shadow-md"
          style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
        >
          <Plus size={15} /> New Offer
        </motion.button>
      </div>

      {/* Status message */}
      <AnimatePresence>
        {statusMsg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-bold"
          >{statusMsg}</motion.div>
        )}
      </AnimatePresence>

      {/* Existing offers list */}
      {offers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
          <span className="text-5xl inline-block">🏷️🐼</span>
          <p className="font-black text-slate-700">No Offers Yet</p>
          <p className="text-sm text-slate-400">Create your first offer using the button above</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => {
            const gradStyle = `linear-gradient(${offer.gradient})`;
            const isExpired = offer.expiresAt ? Date.now() > offer.expiresAt : false;
            return (
              <motion.div key={offer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl overflow-hidden shadow-lg border border-slate-100 relative group"
                style={{ opacity: (!offer.isEnabled || isExpired) ? 0.6 : 1 }}
              >
                {/* Card preview */}
                <div className="h-28 relative overflow-hidden" style={{ background: gradStyle }}>
                  {offer.imageUrl && offer.postType !== 'instagram' && (
                    <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover mix-blend-overlay opacity-60"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  )}
                  {offer.postType === 'instagram' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 opacity-70">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                  )}
                  {/* badge on card */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black text-white"
                      style={{ background: offer.badgeColor }}>{offer.badge}</span>
                  </div>
                  {isExpired && (
                    <div className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">EXPIRED</div>
                  )}
                </div>

                <div className="bg-white p-4 space-y-2">
                  <h4 className="font-black text-slate-900 text-sm line-clamp-1">{offer.title}</h4>
                  {offer.subtitle && <p className="text-xs text-slate-500 line-clamp-1">{offer.subtitle}</p>}
                  {offer.expiresAt && (
                    <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(offer.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    {/* Toggle */}
                    <button onClick={() => handleToggle(offer.id)}
                      className={`flex items-center gap-2 text-xs font-black rounded-full px-3 py-1.5 transition-all ${
                        offer.isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {offer.isEnabled ? <><CheckCircle size={12} /> Live</> : <><XCircle size={12} /> Hidden</>}
                    </button>
                    <div className="flex gap-1.5">
                      <button onClick={() => { setEditing({ ...offer }); setEditExpireAmount(''); }}
                        className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => handleDelete(offer.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create offer drawer */}
      <AnimatePresence>
        {isCreating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-end bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setIsCreating(false); }}
          >
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="relative bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-base">✨ Create New Offer</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Saved to TiDB Cloud database</p>
                </div>
                <button onClick={() => setIsCreating(false)} className="p-2 rounded-full hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-6">
                <OfferFormFields
                  data={newOffer}
                  onChange={(next) => setNewOffer((p) => ({ ...p, ...next } as Omit<Offer, 'id'>))}
                  fileRef={imageFileRef}
                  onFileUpload={(files) => handleImageUpload(files, 'new')}
                />

                {/* Expiry */}
                <div>
                  <label className="text-xs font-black text-slate-600 block mb-2">⏰ Auto-Expire After (optional)</label>
                  <div className="flex gap-2">
                    <input type="number" min={1} value={expireAmount}
                      onChange={(e) => setExpireAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 24"
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    />
                    <select value={expireUnit} onChange={(e) => setExpireUnit(e.target.value as 'hours' | 'days')}
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                    >
                      <option value="hours">hours</option>
                      <option value="days">days</option>
                    </select>
                  </div>
                </div>

                {/* Live mini preview */}
                <div>
                  <label className="text-xs font-black text-slate-600 block mb-2">👁️ Card Preview</label>
                  <div className="rounded-2xl overflow-hidden shadow-md" style={{ background: `linear-gradient(${newOffer.gradient})` }}>
                    {newOffer.imageUrl && newOffer.postType !== 'instagram' && (
                      <div className="h-24 overflow-hidden">
                        <img src={newOffer.imageUrl} alt="" className="w-full h-full object-cover opacity-70" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    )}
                    {newOffer.postType === 'instagram' && (
                      <div className="h-20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 opacity-70">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                    )}
                    <div className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black text-white text-shadow"
                        style={{ background: newOffer.badgeColor || '#059669' }}>{newOffer.badge || 'OFFER'}</span>
                      <h4 className="text-white font-black text-sm mt-2 drop-shadow-sm">{newOffer.title || 'Your offer title here...'}</h4>
                      {newOffer.subtitle && <p className="text-white/75 text-xs mt-1">{newOffer.subtitle}</p>}
                      <div className="mt-3 py-2 rounded-xl text-center text-white text-xs font-black"
                        style={{ background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)' }}>
                        {newOffer.ctaText || 'Order Now'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pb-4">
                  <button onClick={() => setIsCreating(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600">Cancel</button>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={handleCreate}
                    className="flex-1 py-3 rounded-xl text-white font-black text-sm shadow-md"
                    style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}
                  >
                    <Save size={14} className="inline mr-1" /> Publish Offer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit drawer */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-end bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}
          >
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="relative bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-base">✏️ Edit Offer</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Changes saved to TiDB Cloud</p>
                </div>
                <button onClick={() => setEditing(null)} className="p-2 rounded-full hover:bg-slate-100"><X size={18} /></button>
              </div>

              <div className="px-6 py-5 space-y-6">
                <OfferFormFields
                  data={editing}
                  onChange={(next) => setEditing((p) => p ? { ...p, ...next } : p)}
                  fileRef={editImageRef}
                  onFileUpload={(files) => handleImageUpload(files, 'edit')}
                />

                {/* Expiry */}
                <div>
                  <label className="text-xs font-black text-slate-600 block mb-2">⏰ Update Expiry (optional)</label>
                  <div className="flex gap-2">
                    <input type="number" min={1} value={editExpireAmount}
                      onChange={(e) => setEditExpireAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 12"
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    />
                    <select value={editExpireUnit} onChange={(e) => setEditExpireUnit(e.target.value as 'hours' | 'days')}
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                    >
                      <option value="hours">hours</option>
                      <option value="days">days</option>
                    </select>
                  </div>
                  {editing.expiresAt && (
                    <p className="text-[11px] text-amber-600 font-bold mt-1 flex items-center gap-1">
                      <Clock size={10} /> Currently expires: {new Date(editing.expiresAt).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pb-4">
                  <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600">Cancel</button>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={handleSaveEdit}
                    className="flex-1 py-3 rounded-xl text-white font-black text-sm shadow-md"
                    style={{ background: 'linear-gradient(135deg,#065F46,#059669)' }}
                  >
                    <Save size={14} className="inline mr-1" /> Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER PANEL SHELL
// ─────────────────────────────────────────────────────────────────────────────
type Tab = 'orders' | 'products' | 'bases' | 'toppings' | 'blogs' | 'stories' | 'offers';

const TABS: { id: Tab; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'orders', label: 'Live Orders', icon: <ShoppingBag size={14} />, color: '#10B981' },
  { id: 'products', label: 'Products', icon: <Grid3X3 size={14} />, color: '#065F46' },
  { id: 'bases', label: 'Waffle Bases', icon: <Layers size={14} />, color: '#D97706' },
  { id: 'toppings', label: 'Toppings', icon: <Sparkles size={14} />, color: '#7C3AED' },
  { id: 'blogs', label: 'Blog Posts', icon: <BookOpen size={14} />, color: '#0D9488' },
  { id: 'stories', label: 'Stories', icon: <Eye size={14} />, color: '#3b82f6' },
  { id: 'offers', label: 'Offers', icon: <Tag size={14} />, color: '#D97706' },
];

function MasterPanel({ onLock }: { onLock: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const { menuItems, waffleBases, extraToppings, blogPosts, productOrderCounts, productImages, isLoyaltyEnabled, setIsLoyaltyEnabled, masterPassword, setMasterPassword } = useStore();

  const totalVisible = (menuItems || []).filter((i) => i.isEnabled !== false).length;
  const totalProducts = (menuItems || []).length;
  const totalImages = (menuItems || []).filter((i) => Boolean(i.imageUrl || (i.images && i.images.length > 0))).length;
  const totalOrders = Object.values(productOrderCounts).reduce((s, c) => s + c, 0);
  const enabledBlogs = blogPosts.filter((p) => p.enabled).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 border-b border-slate-800/50 shadow-lg"
        style={{ background: 'linear-gradient(135deg,#0F172A,#1E293B)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-xl shadow-md">🐼</div>
          <div>
            <h1 className="text-white font-black text-base leading-none">Master Panel</h1>
            <p className="text-slate-400 text-[11px] mt-0.5">Pandas Waffle House · Admin</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-5">
          {[
            { label: 'Products', value: `${totalVisible}/${totalProducts}`, color: '#34D399' },
            { label: 'Images', value: totalImages, color: '#FCD34D' },
            { label: 'Total Orders', value: totalOrders, color: '#F9A8D4' },
            { label: 'Blog Posts', value: `${enabledBlogs}/${blogPosts.length}`, color: '#67E8F9' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className="font-black text-lg leading-none" style={{ color }}>{value}</p>
              <p className="text-slate-500 text-[10px] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 mr-2 bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-700">
            <span className="text-[10px] font-bold text-slate-300">Loyalty System</span>
            <button
              onClick={() => setIsLoyaltyEnabled(!isLoyaltyEnabled)}
              className={`w-9 h-5 rounded-full relative transition-colors ${isLoyaltyEnabled ? 'bg-emerald-500' : 'bg-slate-600'}`}
            >
              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all ${isLoyaltyEnabled ? 'left-[19px]' : 'left-1'}`} />
            </button>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
          >
            <ShieldCheck size={13} /> Change Password
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={onLock}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
          >
            <Lock size={13} /> Lock
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showPasswordModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-base">Change Master Password</h3>
                <button onClick={() => setShowPasswordModal(false)} className="p-2 rounded-full hover:bg-slate-100"><X size={16} /></button>
              </div>
              <div>
                <label className="text-xs font-black text-slate-600 block mb-1">New Password</label>
                <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={masterPassword}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600">Cancel</button>
                <motion.button whileTap={{ scale: 0.96 }}
                  onClick={() => { if (newPassword.trim()) { setMasterPassword(newPassword.trim()); setShowPasswordModal(false); setNewPassword(''); } }}
                  className="flex-1 py-3 rounded-xl text-white font-black text-sm" style={{ background: 'linear-gradient(135deg,#065F46,#059669)' }}>
                  <Save size={14} className="inline mr-1" /> Update
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab nav */}
      <div className="sticky top-[61px] z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto no-scrollbar py-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0"
              style={activeTab === tab.id
                ? { background: `${tab.color}18`, color: tab.color, boxShadow: `0 0 0 2px ${tab.color}33` }
                : { color: '#64748B' }
              }
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }}>
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'bases' && <WaffleBasesTab />}
            {activeTab === 'toppings' && <ToppingsTab />}
            {activeTab === 'blogs' && <BlogPostsTab />}
            {activeTab === 'stories' && <StoriesTab />}
            {activeTab === 'offers' && <OffersTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page entry point
// ─────────────────────────────────────────────────────────────────────────────
export default function MasterPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <AnimatePresence mode="wait">
      {unlocked ? (
        <motion.div key="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <MasterPanel onLock={() => setUnlocked(false)} />
        </motion.div>
      ) : (
        <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <AccessGate onUnlock={() => setUnlocked(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
