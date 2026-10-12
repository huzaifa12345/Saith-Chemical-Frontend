'use client';

import { useState } from 'react';
import TopBar from '@/components/TopBar';
import SideDrawer from '@/components/SideDrawer';
import ThemeFooter from '@/components/ThemeFooter';

/**
 * Storefront shell matching Vite layout:
 * TopBar (menu toggle) + SideDrawer + page content + ThemeFooter
 */
export default function ProductPageChrome({ children, showFooter = true }) {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  return (
    <>
      <TopBar onMenuToggle={() => setSideDrawerOpen(true)} />
      <SideDrawer
        isOpen={sideDrawerOpen}
        onClose={() => setSideDrawerOpen(false)}
      />
      {children}
      {showFooter ? <ThemeFooter /> : null}
    </>
  );
}
