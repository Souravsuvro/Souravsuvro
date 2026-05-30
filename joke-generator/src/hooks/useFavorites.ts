import { useState, useEffect, useCallback } from 'react';
import { Joke } from '../types/index';

const FAVORITES_STORAGE_KEY = 'favorite-jokes';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Joke[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((joke: Joke) => {
    setFavorites((prev) => {
      const exists = prev.some((j) => j.setup === joke.setup);
      if (exists) return prev;
      return [joke, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((jokeSetup: string) => {
    setFavorites((prev) => prev.filter((j) => j.setup !== jokeSetup));
  }, []);

  const isFavorite = useCallback(
    (jokeSetup: string) => {
      return favorites.some((j) => j.setup === jokeSetup);
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const exportFavorites = useCallback(() => {
    const dataStr = JSON.stringify(favorites, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'favorite-jokes.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    exportFavorites,
  };
};