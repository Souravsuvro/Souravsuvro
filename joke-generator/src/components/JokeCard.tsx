import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Heart, Share2, Volume2, RotateCcw } from 'lucide-react';
import { Joke } from '../types/index';
import toast from 'react-hot-toast';

interface JokeCardProps {
  joke: Joke | null;
  isLoading: boolean;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onShare: () => void;
  onRefresh: () => void;
}

export const JokeCard: React.FC<JokeCardProps> = ({
  joke,
  isLoading,
  isFavorite,
  onFavoriteToggle,
  onShare,
  onRefresh,
}) => {
  const [showPunchline, setShowPunchline] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!joke) return;

    const jokeText = `${joke.setup}\n\n${joke.punchline}`;
    navigator.clipboard.writeText(jokeText);
    
    setIsCopied(true);
    toast.success('Copied to clipboard!');
    
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!joke) return;

    const utterance = new SpeechSynthesisUtterance(
      `${joke.setup}. ${joke.punchline}`
    );
    window.speechSynthesis.speak(utterance);
    toast.success('Speaking...');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 min-h-96 flex flex-col justify-between">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">Loading a funny joke...</p>
            </div>
          </div>
        ) : joke ? (
          <>
            <div className="space-y-6 flex-1">
              {/* Setup */}
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  {joke.source || 'Random'}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed">
                  {joke.setup}
                </p>
              </div>

              {/* Punchline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showPunchline ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {showPunchline && (
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 leading-relaxed">
                    {joke.punchline}
                  </p>
                )}
              </motion.div>

              {/* Reveal Button */}
              {!showPunchline && (
                <button
                  onClick={() => setShowPunchline(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  <RotateCcw size={16} />
                  Reveal Punchline
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isCopied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Copy size={18} />
                {isCopied ? 'Copied!' : 'Copy'}
              </button>

              <button
                onClick={handleSpeak}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Volume2 size={18} />
                Speak
              </button>

              <button
                onClick={onFavoriteToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'Liked' : 'Like'}
              </button>

              <button
                onClick={onShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Share2 size={18} />
                Share
              </button>

              <button
                onClick={onRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                <RotateCcw size={18} />
                Next Joke
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Click "Get Joke" to start laughing!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};