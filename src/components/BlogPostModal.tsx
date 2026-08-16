'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Send } from 'lucide-react';
import { BlogPost, useStore } from '@/store/useStore';

interface BlogPostModalProps {
  post: BlogPost;
  onClose: () => void;
}

export default function BlogPostModal({ post, onClose }: BlogPostModalProps) {
  const { addBlogComment } = useStore();
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');

  const getInstaEmbedUrl = (url?: string) => {
    if (!url) return '';
    const cleanUrl = url.split('?')[0].replace(/\/$/, '');
    return `${cleanUrl}/embed`;
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;

    addBlogComment(post.id, {
      id: `comment-${Date.now()}`,
      user: userName.trim(),
      text: newComment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    setNewComment('');
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[100dvh] sm:h-auto sm:max-h-[90vh]"
        >
          {/* Modal Header with Cancel Button */}
          <div className="shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-slate-100 bg-white z-10">
            <h3 className="font-black text-slate-800 text-sm sm:text-base px-2">Blog Post</h3>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-colors"
            >
              <X size={16} /> Cancel
            </button>
          </div>

          <div className="overflow-y-auto no-scrollbar flex-1 flex flex-col">
            {/* Media */}
            <div className={`relative shrink-0 w-full bg-black ${post.instagramUrl ? 'h-[40vh] sm:h-[500px] min-h-[300px]' : 'aspect-video'}`}>
              {post.instagramUrl ? (
                <iframe
                  src={getInstaEmbedUrl(post.instagramUrl)}
                  className="w-full h-full border-none"
                  scrolling="no"
                  allowTransparency={true}
                />
              ) : (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Content & Comments */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                    style={{ background: post.color }}>
                    {post.emoji} {post.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{post.date} • {post.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">
                  {post.title}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {post.subtitle}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 my-4" />

              {/* Comments Section */}
              <div className="flex-1 flex flex-col min-h-0">
                <h3 className="font-black text-slate-900 flex items-center gap-2 mb-4">
                  <MessageSquare size={18} className="text-teal-600" />
                  Comments ({post.comments?.length || 0})
                </h3>

                <div className="flex-1 overflow-y-auto space-y-4 mb-6 no-scrollbar">
                  {!post.comments?.length ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                      No comments yet. Be the first to share your thoughts!
                    </div>
                  ) : (
                    post.comments.map(comment => (
                      <div key={comment.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-slate-900">{comment.user}</span>
                          <span className="text-[10px] text-slate-400">{comment.date}</span>
                        </div>
                        <p className="text-sm text-slate-600">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="mt-auto shrink-0 space-y-3 bg-white border-t border-slate-100 pt-4">
                  <input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400"
                  />
                  <div className="relative">
                    <input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      required
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || !userName.trim()}
                      className="absolute right-2 top-2 p-1.5 bg-teal-600 text-white rounded-lg disabled:opacity-50 hover:bg-teal-700 transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
