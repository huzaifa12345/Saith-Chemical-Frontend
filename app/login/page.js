import LoginForm from '@/components/auth/LoginForm';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Login',
  description: 'Sign in to your Saith Chemical account.',
  path: '/login',
  noIndex: true,
});

export default function LoginPage() {
  return <LoginForm />;
}
