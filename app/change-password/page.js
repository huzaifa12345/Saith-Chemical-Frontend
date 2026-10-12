import ChangePasswordForm from '@/components/auth/ChangePasswordForm';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Change Password',
  description: 'Update your Saith Chemical account password.',
  path: '/change-password',
  noIndex: true,
});

export default function ChangePasswordPage() {
  return <ChangePasswordForm />;
}
