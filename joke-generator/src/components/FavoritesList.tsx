import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Copy } from 'lucide-react';
import { Joke } from '../types/index';
import toast from 'react-hot-toast';

interface FavoritesListProps {
  favorites: Joke[];
  onRemove: (jokeSetup: string) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onRemove }) => {
  const handleCopyFavorite = (joke: Joke) => {
    const jokeText = `${joke.setup}\n\n${joke.punchline}`;
    navigator.clipboard.writeText(jokeText);
    toast.success('Copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 space-y-3 max-h-96 overflow-y-auto"
    >
      {favorites.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          No favorite jokes yet!
        </p>
      ) : (
        <AnimatePresence>
          {favorites.map((joke, index) => (
            <motion.div
              key={`${joke.setup}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                {joke.setup}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                {joke.punchline}
              </p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopyFavorite(joke)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
                >
                  <Copy size={12} />
                  Copy
                </button>
                <button
                  onClick={() => {
                    onRemove(joke.setup);
                    toast.success('Removed!');
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
};