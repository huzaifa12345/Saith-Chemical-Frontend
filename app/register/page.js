import RegisterForm from '@/components/auth/RegisterForm';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Register',
  description: 'Create a Saith Chemical account.',
  path: '/register',
  noIndex: true,
});

export default function RegisterPage() {
  return <RegisterForm />;
}
