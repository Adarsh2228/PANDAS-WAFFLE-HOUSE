'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { X, MapPin } from 'lucide-react';

interface TableModalProps {
  onClose: () => void;
}

export default function TableModal({ onClose }: TableModalProps) {
  const { tableNumber, setTableNumber } = useStore();
  const [inputVal, setInputVal] = useState(tableNumber);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setTableNumber(inputVal.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-amber-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <MapPin size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Select Table</h3>
            <p className="text-xs text-slate-500">Enter your QR Table Number</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. 4 or Outdoor-A"
              className="w-full text-center text-2xl font-black tracking-wider py-3 border-2 border-amber-200 rounded-2xl focus:border-emerald-600 focus:outline-none bg-amber-50/50"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-800 text-white font-bold py-3.5 rounded-2xl shadow-lg hover:bg-emerald-900 transition-colors"
          >
            Confirm Table #{inputVal}
          </button>
        </form>
      </div>
    </div>
  );
}
