'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Upload, Trash2, Lock, CheckCircle, XCircle,
  ShieldCheck, Search, Plus, Pencil, Save, X, Grid3X3,
  Layers, Sparkles, BookOpen, ToggleLeft, ToggleRight, GripVertical, ShoppingBag, Check
} from 'lucide-react';
import { ALL_MENU_ITEMS, CATEGORY_CONFIG } from '@/data/menuData';
import { MenuItemData, WaffleBaseOption, ToppingOption, BlogPost, Story, useStore } from '@/store/useStore';

// ─────────────────────────────────────────────────────────────────────────────
// Access Gate
// ─────────────────────────────────────────────────────────────────────────────
function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const masterPassword = useStore((state) => state.masterPassword);
  const [code, setCode]       = useState('');
  const [error, setError]     = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === masterPassword) {
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
// PRODUCTS TAB
// ─────────────────────────────────────────────────────────────────────────────
function ProductsTab() {
  const { menuItems, updateMenuItem, productImages, setProductImages, productVisibility, setProductVisibility, productOrderCounts } = useStore();
  const [search, setSearch]   = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const CATS = ['All', 'Sandwich Waffle', 'Belgium Waffle', 'Bowl Cake', 'Pan Cake', 'Offers'];

  const handleToggle = (id: string) => {
    setProductVisibility({ ...productVisibility, [id]: !(productVisibility[id] ?? true) });
  };

  const handleEnableAll = () => {
    const newVis = { ...productVisibility };
    menuItems.forEach((item) => { newVis[item.id] = true; });
    setProductVisibility(newVis);
  };

  const handleDisableAll = () => {
    const newVis = { ...productVisibility };
    menuItems.forEach((item) => { newVis[item.id] = false; });
    setProductVisibility(newVis);
  };

  const handleAddImages = (id: string, files: FileList) => {
    const readers = Array.from(files).map((file) => new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = (e) => res(e.target?.result as string);
      r.readAsDataURL(file);
    }));
    Promise.all(readers).then((b64s) => {
      setProductImages({ ...productImages, [id]: [...(productImages[id] ?? []), ...b64s] });
    });
  };

  const handleRemoveImage = (id: string, idx: number) => {
    const imgs = (productImages[id] ?? []).filter((_, i) => i !== idx);
    setProductImages({ ...productImages, [id]: imgs });
  };

  const handleSaveItem = (item: MenuItemData) => {
    updateMenuItem(item);
    setEditingItem(null);
  };

  const filtered = (menuItems || []).filter((item) => {
    const cat   = filterCat === 'All' || item.category === filterCat;
    const srch  = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return cat && srch;
  });

  return (
    <div className="space-y-4">
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
          const isVisible = productVisibility[item.id] ?? true;
          const imgs      = productImages[item.id] ?? [];
          const config    = CATEGORY_CONFIG[item.category];
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
                         item.price5pc   ? `5pc ₹${item.price5pc} / 10pc ₹${item.price10pc}` :
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
                      {isVisible ? 'Visible' : 'Hidden'}
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
                { label: 'Name',        field: 'name' as keyof MenuItemData },
                { label: 'Description', field: 'description' as keyof MenuItemData },
                { label: 'Prep Time',   field: 'prepTime' as keyof MenuItemData },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="text-xs font-black text-slate-600 block mb-1">{label}</label>
                  <input value={editingItem[field] as string || ''} onChange={(e) => setEditingItem({ ...editingItem, [field]: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Base Price',   field: 'basePrice' as keyof MenuItemData },
                  { label: 'Price Small',  field: 'priceSmall' as keyof MenuItemData },
                  { label: 'Price Big',    field: 'priceBig' as keyof MenuItemData },
                  { label: 'Price 5pc',    field: 'price5pc' as keyof MenuItemData },
                  { label: 'Price 10pc',   field: 'price10pc' as keyof MenuItemData },
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
                  <Save size={14} className="inline mr-1" /> Save Details
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
  const [isNew, setIsNew]     = useState(false);

  const blank: WaffleBaseOption = { id: '', name: '', description: '', price: 0, icon: '🧇' };

  const handleSave = (base: WaffleBaseOption) => {
    if (isNew) {
      setWaffleBases([...waffleBases, { ...base, id: `base-${Date.now()}` }]);
    } else {
      setWaffleBases(waffleBases.map((b) => b.id === base.id ? base : b));
    }
    setEditing(null); setIsNew(false);
  };

  const handleDelete = (id: string) => setWaffleBases(waffleBases.filter((b) => b.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-500">{waffleBases.length} waffle bases</p>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setEditing({ ...blank }); setIsNew(true); }}
          className="flex items-center gap-2 text-white font-black text-xs px-4 py-2.5 rounded-xl"
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
                <h3 className="font-black text-slate-900 text-base">{isNew ? 'Add New Base' : 'Edit Base'}</h3>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-2 rounded-full hover:bg-slate-100"><X size={16} /></button>
              </div>
              {[
                { label: 'Icon (emoji)', field: 'icon' as const },
                { label: 'Name', field: 'name' as const },
                { label: 'Description', field: 'description' as const },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="text-xs font-black text-slate-600 block mb-1">{label}</label>
                  <input value={editing[field] as string} onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                </div>
              ))}
              <div>
                <label className="text-xs font-black text-slate-600 block mb-1">Price (₹) — 0 = FREE</label>
                <input type="number" min={0} value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600">Cancel</button>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => handleSave(editing)} className="flex-1 py-3 rounded-xl text-white font-black text-sm" style={{ background: 'linear-gradient(135deg,#065F46,#059669)' }}>
                  <Save size={14} className="inline mr-1" /> Save
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
  const [isNew, setIsNew]     = useState(false);
  const blank: ToppingOption  = { id: '', name: '', price: 0 };

  const handleSave = (top: ToppingOption) => {
    if (isNew) {
      setExtraToppings([...extraToppings, { ...top, id: `top-${Date.now()}` }]);
    } else {
      setExtraToppings(extraToppings.map((t) => t.id === top.id ? top : t));
    }
    setEditing(null); setIsNew(false);
  };

  const handleDelete = (id: string) => setExtraToppings(extraToppings.filter((t) => t.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-500">{extraToppings.length} toppings</p>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setEditing({ ...blank }); setIsNew(true); }}
          className="flex items-center gap-2 text-white font-black text-xs px-4 py-2.5 rounded-xl"
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
                  <Save size={14} className="inline mr-1" /> Save
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
  const { blogPosts, toggleBlogPost, setBlogPosts } = useStore();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [expireAmount, setExpireAmount] = useState<number | ''>('');
  const [expireUnit, setExpireUnit] = useState<'hours' | 'days'>('days');

  const enabledCount = blogPosts.filter((p) => p.enabled).length;

  const handleSave = (post: BlogPost) => {
    let finalPost = { ...post };
    if (expireAmount && Number(expireAmount) > 0) {
      const multiplier = expireUnit === 'days' ? 24 * 3600 * 1000 : 3600 * 1000;
      finalPost.expiresAt = Date.now() + Number(expireAmount) * multiplier;
    } else {
      finalPost.expiresAt = undefined;
    }
    setBlogPosts(blogPosts.map((p) => p.id === post.id ? finalPost : p));
    setEditing(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditing({ ...post });
    setExpireAmount('');
    setExpireUnit('days');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <p className="text-sm font-bold text-slate-500 flex-1">{enabledCount} of {blogPosts.length} posts enabled</p>
        <div className="text-xs text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full font-bold">
          Toggle to publish/unpublish
        </div>
      </div>

      <div className="space-y-3">
        {blogPosts.map((post, idx) => (
          <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center gap-0">
              {/* Thumbnail */}
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 px-4 py-3 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white" style={{ background: post.color }}>
                        {post.emoji} {post.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{post.readTime}</span>
                    </div>
                    <h4 className="font-black text-slate-900 text-sm mt-1 leading-snug line-clamp-1">{post.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{post.subtitle}</p>
                  </div>

                  {/* Toggle */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleBlogPost(post.id)}
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
                      onClick={() => handleEdit(post)}
                      className="flex items-center gap-1 text-xs font-black px-3 py-1 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Status bar */}
            <div className="h-0.5" style={{ background: post.enabled ? post.color : '#E2E8F0' }} />
          </div>
        ))}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 my-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-base">Edit Blog Post</h3>
                <button onClick={() => setEditing(null)} className="p-2 rounded-full hover:bg-slate-100"><X size={16} /></button>
              </div>

              {[
                { label: 'Title',    field: 'title'    as keyof BlogPost },
                { label: 'Subtitle', field: 'subtitle' as keyof BlogPost },
                { label: 'Category', field: 'category' as keyof BlogPost },
                { label: 'Emoji',    field: 'emoji'    as keyof BlogPost },
                { label: 'Read Time',field: 'readTime' as keyof BlogPost },
                { label: 'Date',     field: 'date'     as keyof BlogPost },
                { label: 'Image URL',field: 'imageUrl' as keyof BlogPost },
                { label: 'Color (hex)', field: 'color' as keyof BlogPost },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="text-xs font-black text-slate-600 block mb-1">{label}</label>
                  <input value={editing[field] as string} onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
                </div>
              ))}

              <div>
                <label className="text-xs font-black text-slate-600 block mb-1">Instagram Embed URL</label>
                <input value={editing.instagramUrl || ''} onChange={(e) => setEditing({ ...editing, instagramUrl: e.target.value })}
                  placeholder="https://www.instagram.com/p/..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-600 block mb-1">Display Duration Timer</label>
                <div className="flex gap-2">
                  <input type="number" min="0" value={expireAmount} onChange={(e) => setExpireAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="E.g. 3 (Leave empty for no expiry)"
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100" />
                  <select value={expireUnit} onChange={(e) => setExpireUnit(e.target.value as 'hours' | 'days')}
                    className="w-24 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100">
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600">Cancel</button>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => handleSave(editing)} className="flex-1 py-3 rounded-xl text-white font-black text-sm" style={{ background: 'linear-gradient(135deg,#0D9488,#0891B2)' }}>
                  <Save size={14} className="inline mr-1" /> Save
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
  const { stories, addStory, deleteStory } = useStore();
  const [imageUrl, setImageUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handlePost = () => {
    if (!imageUrl) return;
    addStory({
      id: `story-${Date.now()}`,
      imageUrl,
      thumbnailUrl,
      caption,
      createdAt: Date.now(),
    });
    setImageUrl('');
    setThumbnailUrl('');
    setCaption('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-black text-slate-900 mb-4">Post New Story</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-black text-slate-600 block mb-1">Image/Video URL (Main Content)</label>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-600 block mb-1">Thumbnail URL (Optional - For Status Circle)</label>
            <input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-600 block mb-1">Caption (Optional)</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)}
              placeholder="Check out our new..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <motion.button whileTap={{ scale: 0.96 }} onClick={handlePost} disabled={!imageUrl}
            className="w-full py-3 rounded-xl text-white font-black text-sm disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
            <Upload size={14} className="inline mr-1" /> Post to Story
          </motion.button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-black text-slate-900">Active Stories ({stories.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stories.map(story => {
            const hrs = Math.round((Date.now() - story.createdAt) / 3600000);
            return (
              <div key={story.id} className="relative aspect-[9/16] bg-slate-100 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <img src={story.imageUrl} alt="Story" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white font-bold">
                  {hrs}h ago
                </div>
                <button onClick={() => deleteStory(story.id)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  <Trash2 size={12} />
                </button>
                {story.caption && (
                  <div className="absolute bottom-4 left-2 right-2 text-center text-white text-[10px] font-bold px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg line-clamp-2">
                    {story.caption}
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
// MASTER PANEL SHELL
// ─────────────────────────────────────────────────────────────────────────────
type Tab = 'orders' | 'products' | 'bases' | 'toppings' | 'blogs' | 'stories';

const TABS: { id: Tab; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'orders',   label: 'Live Orders',   icon: <ShoppingBag size={14} />, color: '#10B981' },
  { id: 'products', label: 'Products',      icon: <Grid3X3 size={14} />,  color: '#065F46' },
  { id: 'bases',    label: 'Waffle Bases',  icon: <Layers size={14} />,   color: '#D97706' },
  { id: 'toppings', label: 'Toppings',      icon: <Sparkles size={14} />, color: '#7C3AED' },
  { id: 'blogs',    label: 'Blog Posts',    icon: <BookOpen size={14} />, color: '#0D9488' },
  { id: 'stories',  label: 'Stories',       icon: <Eye size={14} />,      color: '#3b82f6' },
];

function MasterPanel({ onLock }: { onLock: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const { waffleBases, extraToppings, blogPosts, productOrderCounts, productImages, productVisibility, setProductImages, setProductVisibility, isLoyaltyEnabled, setIsLoyaltyEnabled, masterPassword, setMasterPassword } = useStore();

  const totalVisible  = Object.values(productVisibility).filter(Boolean).length + (ALL_MENU_ITEMS.length - Object.keys(productVisibility).length);
  const totalImages   = Object.values(productImages).reduce((s, arr) => s + arr.length, 0);
  const totalOrders   = Object.values(productOrderCounts).reduce((s, c) => s + c, 0);
  const enabledBlogs  = blogPosts.filter((p) => p.enabled).length;

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
            { label: 'Products',    value: `${totalVisible}/${ALL_MENU_ITEMS.length}`, color: '#34D399' },
            { label: 'Images',      value: totalImages,    color: '#FCD34D' },
            { label: 'Total Orders',value: totalOrders,    color: '#F9A8D4' },
            { label: 'Blog Posts',  value: `${enabledBlogs}/${blogPosts.length}`, color: '#67E8F9' },
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
                  onClick={() => { if(newPassword.trim()) { setMasterPassword(newPassword.trim()); setShowPasswordModal(false); setNewPassword(''); } }} 
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
            {activeTab === 'orders'   && <OrdersTab />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'bases'    && <WaffleBasesTab />}
            {activeTab === 'toppings' && <ToppingsTab />}
            {activeTab === 'blogs'    && <BlogPostsTab />}
            {activeTab === 'stories'  && <StoriesTab />}
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
