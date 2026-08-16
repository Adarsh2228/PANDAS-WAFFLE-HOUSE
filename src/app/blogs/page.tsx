import type { Metadata } from 'next';
import BlogsSection from '@/components/BlogsSection';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: "Panda's Blog 📖 | Pandas Waffle House",
  description: 'Stories, recipes and waffle wisdom from the Pandas Waffle House kitchen — read about our secret ingredients, panda chef stories and more!',
};

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <BlogsSection />
      </main>
    </div>
  );
}
