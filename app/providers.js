'use client';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LogoProvider } from '@/context/LogoContext';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <LogoProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ff4b4b',
                  secondary: '#fff',
                },
              },
            }}
          />
        </LogoProvider>
      </CartProvider>
    </AuthProvider>
  );
}
