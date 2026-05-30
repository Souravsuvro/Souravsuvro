import React from 'react';
import { Share2 } from 'lucide-react';
import { Joke } from '../types/index';
import toast from 'react-hot-toast';

interface ShareButtonsProps {
  joke: Joke;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ joke }) => {
  const jokeText = encodeURIComponent(`${joke.setup}\n\n${joke.punchline}`);
  const currentUrl = encodeURIComponent(window.location.href);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${jokeText}&url=${currentUrl}`,
      color: 'bg-black hover:bg-gray-800',
    },
    {
      name: 'Facebook',
      icon: 'f',
      url: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${jokeText}`,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`,
      color: 'bg-blue-700 hover:bg-blue-800',
    },
    {
      name: 'Email',
      icon: '✉️',
      url: `mailto:?subject=Check out this joke!&body=${jokeText}`,
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ];

  const handleShare = (url: string, name: string) => {
    window.open(url, '_blank', 'width=600,height=400');
    toast.success(`Sharing on ${name}!`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {shareLinks.map((link) => (
        <button
          key={link.name}
          onClick={() => handleShare(link.url, link.name)}
          className={`flex items-center justify-center gap-1 px-3 py-2 ${link.color} text-white rounded-lg font-medium text-sm transition-all hover:shadow-lg`}
          title={`Share on ${link.name}`}
        >
          <Share2 size={14} />
          {link.name}
        </button>
      ))}
    </div>
  );
};