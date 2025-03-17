import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from "./Header";
import { useStoreTheme } from '../context/StoreThemeContext';

export const Layout: React.FC = () => {
  const location = useLocation();
  const { resetTheme } = useStoreTheme();
  const isStorePage = location.pathname.startsWith('/stores/');

  // Reset theme when not on a store page
  React.useEffect(() => {
    if (!isStorePage) {
      console.log('Layout: Not on store page, resetting theme');
      resetTheme();
    }
  }, [location.pathname, isStorePage, resetTheme]);

  return (
    <div className="min-h-screen transition-colors duration-300" 
         style={{ backgroundColor: 'var(--color-background)' }}>
      <Header />
      <main className="container mx-auto"><Outlet /></main>
    </div>
  );
};