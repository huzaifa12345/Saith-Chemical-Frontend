'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { websiteSettingsApi } from '@/lib/api-client';

const LogoContext = createContext();

const FALLBACK_LOGO =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjEyMCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvZ288L3RleHQ+Cjwvc3ZnPg==';

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};

export const LogoProvider = ({ children }) => {
  const [websiteLogo, setWebsiteLogo] = useState(FALLBACK_LOGO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWebsiteLogo();
  }, []);

  const fetchWebsiteLogo = async () => {
    setLoading(true);
    const response = await websiteSettingsApi.getWebsiteSettings();

    if (response?.success && response.data) {
      const logoCategories = response.data.general || response.data.logo || [];
      const logoSetting = logoCategories.find((s) => s.key === 'website_logo');

      if (logoSetting?.value) {
        setWebsiteLogo(logoSetting.value);
      }
    }
    // If API is offline, keep FALLBACK_LOGO — no console noise in Phase 0/1
    setLoading(false);
  };

  const updateLogo = (newLogo) => {
    setWebsiteLogo(newLogo);
  };

  return (
    <LogoContext.Provider value={{ websiteLogo, loading, updateLogo, fetchWebsiteLogo }}>
      {children}
    </LogoContext.Provider>
  );
};

export default LogoContext;
