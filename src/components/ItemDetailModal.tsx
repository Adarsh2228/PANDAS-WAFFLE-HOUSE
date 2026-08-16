'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { MenuItemData, ReviewItem, useStore } from '@/store/useStore';
import { X, Star, Clock, MessageSquare, Send, Sparkles } from 'lucide-react';

interface ItemDetailModalProps {
  item: MenuItemData;
  onClose: () => void;
  onOpenCustomize: (item: MenuItemData) => void;
}

export default function ItemDetailModal({ item, onClose, onOpenCustomize }: ItemDetailModalProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(item.reviews || []);
  const [authorName, setAuthorName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev: ReviewItem = {
      id: Math.random().toString(36).substring(7),
      authorName: authorName.trim() || `Panda Waffles Guest`,
      rating,
      comment: comment.trim(),
      date: 'Just now'
    };

    setReviews([newRev, ...reviews]);
    setComment('');
    setAuthorName('');
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg sm:rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col h-[100dvh] sm:h-auto sm:max-h-[90vh]">
        {/* Header with Cancel Button */}
        <div className="shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-slate-100 bg-white z-10">
          <h3 className="font-black text-slate-800 text-sm sm:text-base px-2">Item Details</h3>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-colors"
          >
            <X size={16} /> Cancel
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar flex-1 flex flex-col">
          {/* Header Image */}
          <div className="relative h-64 sm:h-72 bg-slate-900 shrink-0">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Title & Info Overlaid on Image Bottom */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="inline-block bg-[#EA580C] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              {item.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-1 text-white drop-shadow-md">
              {item.name}
            </h2>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
              <span className="flex items-center gap-1">
                <Star size={13} className="fill-yellow-400 text-yellow-400" />
                {item.rating} ({reviews.length} reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                Prep time {item.prepTime}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          {/* Base Price Card */}
          <div className="bg-[#FFFDF5] border border-amber-200/80 p-4 rounded-2xl shadow-xs">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-black uppercase text-amber-900 tracking-wider">BASE PRICE</span>
              <span className="text-2xl font-black text-amber-950">₹{item.basePrice}</span>
            </div>
            <p className="text-slate-700 text-sm font-medium leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <MessageSquare size={18} className="text-amber-800" />
              <span>Customer Reviews ({reviews.length})</span>
            </h3>

            {/* Write a Review Box */}
            <form onSubmit={handlePostReview} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <p className="text-xs font-bold text-slate-700">Write a Review for Panda Waffles</p>
              
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Happy Guest)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:border-emerald-600"
                />
                
                {/* Rating Stars Picker */}
                <div className="flex items-center gap-0.5 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5 focus:outline-none hover:scale-125 transition-transform"
                    >
                      <Star size={16} className={star <= rating ? "fill-yellow-400" : "text-slate-300"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Delicious! Panda chef baked it to crispy perfection..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="submit"
                  className="bg-amber-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-amber-900 transition-colors shadow-xs"
                >
                  <Send size={12} /> Post
                </button>
              </div>
            </form>

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-4 italic font-medium">
                No reviews yet. Be the first to leave a review!
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">{rev.authorName}</span>
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} className={i < rev.rating ? "fill-yellow-400" : "text-slate-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-medium italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Button */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenCustomize(item);
            }}
            className="w-full bg-[#4A1E05] hover:bg-[#361502] text-white font-extrabold py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-base"
          >
            <Sparkles size={18} className="text-yellow-300" />
            <span>Customize & Order (₹{item.basePrice})</span>
          </button>
        </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
