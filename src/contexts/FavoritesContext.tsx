'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Rule } from '@/types/rule';

interface FavoritesContextType {
  favorites: Rule[];
  addToFavorites: (rule: Rule) => void;
  removeFromFavorites: (ruleId: string) => void;
  toggleFavorite: (rule: Rule) => void;
  isFavorited: (ruleId: string) => boolean;
  favoritesCount: number;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'cursor-rules-hub-favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Rule[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }
    }
  }, [favorites, isLoaded]);

  const addToFavorites = (rule: Rule) => {
    setFavorites(prev => {
      // Check if already exists to avoid duplicates
      if (prev.some(fav => fav.id === rule.id)) {
        return prev;
      }
      return [...prev, rule];
    });
  };

  const removeFromFavorites = (ruleId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== ruleId));
  };

  const toggleFavorite = (rule: Rule) => {
    const isCurrentlyFavorited = favorites.some(fav => fav.id === rule.id);
    if (isCurrentlyFavorited) {
      removeFromFavorites(rule.id);
    } else {
      addToFavorites(rule);
    }
  };

  const isFavorited = (ruleId: string) => {
    return favorites.some(fav => fav.id === ruleId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorited,
    favoritesCount: favorites.length,
    clearFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 