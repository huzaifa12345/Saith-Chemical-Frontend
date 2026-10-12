'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (adminOnly && user?.role !== 'admin') {
      router.replace('/');
    }
  }, [isAuthenticated, user, isLoading, adminOnly, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (adminOnly && user?.role !== 'admin') return null;

  return children;
}
