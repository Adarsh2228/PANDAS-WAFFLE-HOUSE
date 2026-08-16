import type { Metadata } from 'next';

// This page is intentionally hidden from search engines and not linked anywhere
export const metadata: Metadata = {
  title: 'Admin Panel | Pandas Waffle House',
  robots: { index: false, follow: false },
};

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
