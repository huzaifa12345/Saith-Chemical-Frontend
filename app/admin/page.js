import AdminView from '@/components/admin/AdminView';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Admin',
  description: 'Saith Chemical admin control panel.',
  path: '/admin',
  noIndex: true,
});

export default function AdminPage() {
  return <AdminView />;
}
