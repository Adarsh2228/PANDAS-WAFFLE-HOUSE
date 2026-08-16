'use client';

import { useRef, useEffect, useState } from 'react';
import { Clock, ChevronRight, Heart } from 'lucide-react';
import { useStore, BlogPost } from '@/store/useStore';
import BlogPostModal from './BlogPostModal';

export default function BlogsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const { blogPosts } = useStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  // Only show enabled posts that are not expired
  const enabledPosts = blogPosts.filter((p) => {
    if (!p.enabled) return false;
    if (p.expiresAt && p.expiresAt < Date.now()) return false;
    return true;
  });
  const [featured, ...rest] = enabledPosts;

  const getInstaEmbedUrl = (url?: string) => {
    if (!url) return '';
    const cleanUrl = url.split('?')[0].replace(/\/$/, '');
    return `${cleanUrl}/embed`;
  };

  return (
    <section
      ref={sectionRef}
      id="section-blogs"
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#0D9488,#0891B2)' }}
        >
          📖
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-teal-700 leading-tight">Panda's Blog</h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Stories, recipes & waffle wisdom</p>
        </div>
        <div className="ml-auto text-4xl hidden sm:block">🐼</div>
      </div>

      {/* No posts enabled state */}
      {enabledPosts.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 shadow-sm">
          <div className="text-6xl">📝🐼</div>
          <h3 className="font-black text-slate-800 text-lg">No Blog Posts Yet!</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
            Blog posts can be enabled from the Master Panel. Once published, they'll appear here!
          </p>
        </div>
      )}

      {/* Featured Post */}
      {featured && (
        <div onClick={() => setSelectedPost(featured)} className="rounded-3xl overflow-hidden mb-6 cursor-pointer shadow-lg animate-scale-in" style={{ animationDelay: '100ms' }}>
          <div className="relative overflow-hidden" style={{ height: featured.instagramUrl ? '550px' : 'auto', aspectRatio: featured.instagramUrl ? 'auto' : '16/7' }}>
            {featured.instagramUrl ? (
              <iframe
                src={getInstaEmbedUrl(featured.instagramUrl)}
                className="w-full h-full border-none bg-white absolute inset-0 z-0"
                scrolling="no"
                allowTransparency={true}
              />
            ) : (
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            )}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.1))' }} />
            <div className="absolute top-4 left-4 bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full pointer-events-none">
              ⭐ Featured
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: featured.color }}>
                  {featured.emoji} {featured.category}
                </span>
                <span className="text-xs text-white/60 flex items-center gap-1">
                  <Clock size={11} /> {featured.readTime}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black leading-tight mb-1">{featured.title}</h3>
              <p className="text-white/75 text-sm line-clamp-2">{featured.subtitle}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-white/60">{featured.date}</span>
                <button className="flex items-center gap-2 text-sm font-black text-white hover:text-teal-300 transition-colors">
                  Read More <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Cards Grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post, idx) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 cursor-pointer shadow-sm hover:shadow-md transition-all"
              style={{ animationDelay: `${(idx + 1) * 80}ms` }}
            >
              <div className={`relative overflow-hidden ${post.instagramUrl ? 'h-[480px]' : 'aspect-[16/9]'}`}>
                {post.instagramUrl ? (
                  <iframe
                    src={getInstaEmbedUrl(post.instagramUrl)}
                    className="w-full h-full border-none bg-white"
                    scrolling="no"
                    allowTransparency={true}
                  />
                ) : (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                )}
                <div
                  className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                  style={{ background: post.color }}
                >
                  {post.emoji} {post.category}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-black text-slate-900 text-sm leading-snug mb-1.5 line-clamp-2">{post.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">{post.subtitle}</p>
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock size={10} /> {post.readTime}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{post.date}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                    className="flex items-center gap-1 text-[11px] font-black transition-all active:scale-125"
                    style={{ color: likedPosts.has(post.id) ? '#EF4444' : '#94A3B8' }}
                  >
                    <Heart size={13} className={likedPosts.has(post.id) ? 'fill-red-500' : ''} />
                    ♥
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPost && (
        <BlogPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </section>
  );
}
