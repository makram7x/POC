import { useState, useEffect } from 'react';
import { Vibrant } from 'node-vibrant/browser';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

const defaultPalette: ColorPalette = {
  primary: '#3B82F6',    // blue-500
  secondary: '#6B7280',  // gray-500
  accent: '#2563EB',     // blue-600
  background: '#F9FAFB', // gray-50
  text: '#111827',       // gray-900
};

export const useColorPalette = (imageUrl: string): ColorPalette => {
  const [palette, setPalette] = useState<ColorPalette>(defaultPalette);

  useEffect(() => {
    const extractColors = async () => {
      try {
        if (!imageUrl) return;
        
        console.log('Extracting colors from:', imageUrl);
        
        // Ensure the image URL is absolute
        const absoluteImageUrl = imageUrl.startsWith('http') 
          ? imageUrl 
          : `${window.location.origin}${imageUrl}`;

        console.log('Using absolute URL:', absoluteImageUrl);

        // Using the builder pattern as shown in the example
        const swatches = await Vibrant.from(absoluteImageUrl).getPalette();

        console.log('Raw swatches:', swatches);

        if (swatches) {
          const newPalette: ColorPalette = {
            primary: swatches.Vibrant?.hex || defaultPalette.primary,
            secondary: swatches.Muted?.hex || defaultPalette.secondary,
            accent: swatches.DarkVibrant?.hex || defaultPalette.accent,
            background: swatches.LightMuted?.hex || defaultPalette.background,
            text: swatches.DarkMuted?.hex || defaultPalette.text,
          };
          console.log('Generated palette:', newPalette);
          setPalette(newPalette);
        }
      } catch (error) {
        console.error('Error extracting colors:', error);
        setPalette(defaultPalette);
      }
    };

    extractColors();
  }, [imageUrl]);

  return palette;
};