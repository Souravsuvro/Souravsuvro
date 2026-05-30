import { useState, useCallback } from 'react';
import { Joke, JokeType } from '../types/index';
import { fetchJoke } from '../services/jokeApi';

export const useJoke = () => {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jokeHistory, setJokeHistory] = useState<Joke[]>([]);

  const getJoke = useCallback(async (type: JokeType = 'random') => {
    setIsLoading(true);
    setError(null);

    try {
      const newJoke = await fetchJoke(type);
      setJoke(newJoke);
      setJokeHistory((prev) => [newJoke, ...prev.slice(0, 9)]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch joke';
      setError(errorMessage);
      console.error('Error fetching joke:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setJokeHistory([]);
  }, []);

  return {
    joke,
    isLoading,
    error,
    jokeHistory,
    getJoke,
    clearError,
    clearHistory,
  };
};