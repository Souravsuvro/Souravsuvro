import React, { useState, useEffect } from 'react';
import { useJoke } from '../hooks/useJoke';
import { useFavorites } from '../hooks/useFavorites';
import { JokeType } from '../types/index';
import { JokeCard } from './JokeCard';
import { FavoritesList } from './FavoritesList';
import { ShareButtons } from './ShareButtons';
import { ThemeToggle } from './ThemeToggle';
import toast from 'react-hot-toast';

export const JokeGenerator: React.FC = () => {
  const [selectedType, setSelectedType] = useState<JokeType>('random');
  const [showFavorites, setShowFavorites] = useState(false);
  const { joke, isLoading, error, getJoke } = useJoke();
  const { addFavorite, removeFavorite, isFavorite, favorites } = useFavorites();

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleGetJoke = () => {
    getJoke(selectedType);
  };

  const handleFavoriteToggle = () => {
    if (!joke) return;

    if (isFavorite(joke.setup)) {
      removeFavorite(joke.setup);
      toast.success('Removed from favorites');
    } else {
      addFavorite(joke);
      toast.success('Added to favorites!');
    }
  };

  const handleShare = () => {
    if (!joke) return;

    const shareData = {
      title: 'Check out this joke!',
      text: `${joke.setup}\n\n${joke.punchline}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error('Error sharing:', err));
    } else {
      toast.error('Share not supported on this browser');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            😂 Joke Generator
          </h1>
          <ThemeToggle />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Get random jokes from multiple sources and share them with friends!
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Joke Type Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Joke Type
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['random', 'general', 'programming', 'knock-knock', 'dark'] as JokeType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                      selectedType === type
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Joke Card */}
          <JokeCard
            joke={joke}
            isLoading={isLoading}
            isFavorite={joke ? isFavorite(joke.setup) : false}
            onFavoriteToggle={handleFavoriteToggle}
            onShare={handleShare}
            onRefresh={handleGetJoke}
          />

          {/* Get Joke Button */}
          <button
            onClick={handleGetJoke}
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            {isLoading ? 'Loading...' : 'Get a Joke! 🎉'}
          </button>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Favorites Toggle */}
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg font-semibold text-gray-900 dark:text-white mb-4 hover:shadow-xl transition-shadow"
          >
            ❤️ Favorites ({favorites.length})
          </button>

          {/* Favorites List */}
          {showFavorites && (
            <FavoritesList
              favorites={favorites}
              onRemove={removeFavorite}
            />
          )}

          {/* Share Buttons */}
          {joke && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Share</h3>
              <ShareButtons
                joke={joke}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-600 dark:text-gray-400">
        <p>Made with ❤️ using React + TypeScript</p>
      </div>
    </div>
  );
};