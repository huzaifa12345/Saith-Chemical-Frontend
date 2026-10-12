import ReturnPolicyView from '@/components/about/ReturnPolicyView';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Return Policy',
  description:
    'Return and refund policy for Saith Chemical products purchased online.',
  path: '/return-policy',
});

export default function ReturnPolicyPage() {
  return <ReturnPolicyView />;
}
