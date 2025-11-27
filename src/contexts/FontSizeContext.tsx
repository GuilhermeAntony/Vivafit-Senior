import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FontSizePreference = 'small' | 'normal' | 'large';

interface FontSizeContextType {
  fontSizePreference: FontSizePreference;
  setFontSizePreference: (size: FontSizePreference) => Promise<void>;
  getFontSize: (baseSize: number) => number;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider = ({ children }: { children: ReactNode }) => {
  const [fontSizePreference, setFontSizePref] = useState<FontSizePreference>('normal');

  useEffect(() => {
    loadFontSizePreference();
  }, []);

  const loadFontSizePreference = async () => {
    try {
      const prefs = await AsyncStorage.getItem('prefs');
      if (prefs) {
        const parsed = JSON.parse(prefs);
        if (parsed.fontSize) {
          setFontSizePref(parsed.fontSize);
        }
      }
    } catch (e) {
      console.error('Erro ao carregar preferência de fonte:', e);
    }
  };

  const setFontSizePreference = async (size: FontSizePreference) => {
    try {
      setFontSizePref(size);
      const prefs = await AsyncStorage.getItem('prefs');
      const current = prefs ? JSON.parse(prefs) : {};
      await AsyncStorage.setItem('prefs', JSON.stringify({ ...current, fontSize: size }));
    } catch (e) {
      console.error('Erro ao salvar preferência de fonte:', e);
    }
  };

  const getFontSize = (baseSize: number): number => {
    switch (fontSizePreference) {
      case 'small':
        return baseSize * 0.875; // 87.5% do tamanho base
      case 'large':
        return baseSize * 1.25;  // 125% do tamanho base
      case 'normal':
      default:
        return baseSize;
    }
  };

  return (
    <FontSizeContext.Provider value={{ fontSizePreference, setFontSizePreference, getFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    // Retornar valores padrão se não estiver dentro do provider
    return {
      fontSizePreference: 'normal' as FontSizePreference,
      setFontSizePreference: async () => {},
      getFontSize: (size: number) => size,
    };
  }
  return context;
};
