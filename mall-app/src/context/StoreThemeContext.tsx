import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { ColorPalette, useColorPalette } from '../hooks/useColorPalette';
import { useLocation } from 'react-router-dom';

interface StoreThemeContextType {
  colors: ColorPalette;
  applyTheme: (imageUrl: string) => void;
  resetTheme: () => void;
}

const defaultPalette: ColorPalette = {
  primary: '#3B82F6',    // blue-500
  secondary: '#6B7280',  // gray-500
  accent: '#2563EB',     // blue-600
  background: '#F9FAFB', // gray-50
  text: '#111827',       // gray-900
};

const StoreThemeContext = createContext<StoreThemeContextType | null>(null);

export const StoreThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const colors = useColorPalette(currentImageUrl);
  const location = useLocation();

  // Check if current route is a store page
  const isStorePage = location.pathname.startsWith('/stores/');

  // Reset theme when navigating away from store pages (only if we have a current theme)
  useEffect(() => {
    if (!isStorePage && currentImageUrl) {
      console.log('Leaving store page, resetting theme to defaults');
      resetTheme();
    }
  }, [location.pathname]);

  // Apply theme colors when entering store pages or when colors are extracted
  useEffect(() => {
    const root = document.documentElement;
    const currentColors = currentImageUrl ? colors : defaultPalette;
    
    // Only apply theme if we have valid colors and either:
    // 1. We're on a store page
    // 2. We're not on a store page and using default colors
    if ((isStorePage && colors) || (!isStorePage && !currentImageUrl)) {
      console.log('Applying theme colors:', currentColors);
      
      root.style.setProperty('--color-primary', currentColors.primary);
      root.style.setProperty('--color-secondary', currentColors.secondary);
      root.style.setProperty('--color-accent', currentColors.accent);
      root.style.setProperty('--color-background', currentColors.background);
      root.style.setProperty('--color-text', currentColors.text);
    }
  }, [isStorePage, colors, currentImageUrl]);

  const applyTheme = (imageUrl: string) => {
    console.log('StoreThemeProvider: Applying theme for image:', imageUrl);
    setCurrentImageUrl(imageUrl);
  };

  const resetTheme = () => {
    console.log('StoreThemeProvider: Resetting theme to defaults');
    setCurrentImageUrl('');
  };

  return (
    <StoreThemeContext.Provider value={{ 
      colors: currentImageUrl ? colors : defaultPalette, 
      applyTheme, 
      resetTheme 
    }}>
      {children}
    </StoreThemeContext.Provider>
  );
};

export const useStoreTheme = () => {
  const context = useContext(StoreThemeContext);
  if (!context) {
    throw new Error('useStoreTheme must be used within a StoreThemeProvider');
  }
  return context;
};