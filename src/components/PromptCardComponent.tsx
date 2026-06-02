/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, Copy, Check, Sparkles, User } from 'lucide-react';
import { PromptCard } from '../types';

interface PromptCardComponentProps {
  key?: React.Key;
  card: PromptCard;
  onToggleFavorite: (id: string) => void;
  onAddNotification: (text: string) => void;
}

export default function PromptCardComponent({ card, onToggleFavorite, onAddNotification }: PromptCardComponentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(card.fullPrompt);
    setCopied(true);
    onAddNotification(`Prompt "${card.title}" copied to clipboard.`);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      id={`prompt-card-${card.id}`}
      className={`relative bg-[#121324] border ${
        card.isFavorite ? 'border-[#3f2963]/80' : 'border-[#1b1c34]'
      } hover:border-[#4c3575] rounded-3xl p-6 shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group overflow-hidden`}
    >
      {/* Visual background lights on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3.5 select-none">
          <h3 className="font-display font-semibold text-[15px] text-white tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            {card.title}
          </h3>

          {/* Heart icon in top-right corner */}
          <button
            id={`btn-heart-${card.id}`}
            onClick={() => {
              onToggleFavorite(card.id);
              onAddNotification(card.isFavorite ? `Removed "${card.title}" from favorites.` : `Added "${card.title}" to favorites.`);
            }}
            className="text-gray-500 hover:text-red-500 transition-colors duration-300 p-1 pointer-events-auto cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-all duration-300 ${
                card.isFavorite ? 'text-red-500 fill-red-500 scale-125' : 'text-gray-400 group-hover:text-gray-300'
              }`}
            />
          </button>
        </div>

        {/* Card short description content representing template excerpt exactly */}
        <p className="text-[12.5px] text-gray-400 leading-relaxed mb-6 font-sans group-hover:text-gray-300 transition-colors duration-300">
          {card.description}
        </p>
      </div>

      {/* Bottom Tool Block */}
      <div className="space-y-3 font-sans mt-auto">
        {/* Save Favorite Button */}
        <button
          id={`btn-save-favorite-${card.id}`}
          onClick={() => {
            onToggleFavorite(card.id);
            onAddNotification(card.isFavorite ? `Removed "${card.title}" from favorites.` : `Added "${card.title}" to favorites.`);
          }}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
            card.isFavorite
              ? 'bg-[#29172f]/40 text-[#c8a1e6] border border-[#a25cc9]/20 hover:bg-[#341b3a]/50'
              : 'text-[#8e8fa3] bg-[#161726]/80 hover:text-white hover:bg-[#202238] border border-transparent'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${card.isFavorite ? 'fill-[#c8a1e6] text-[#c8a1e6]' : ''}`} />
          <span>{card.isFavorite ? 'Favorite Saved' : 'Save Favorite'}</span>
        </button>

        {/* Copy Prompt Button */}
        <button
          id={`btn-copy-prompt-${card.id}`}
          onClick={handleCopy}
          className="w-full py-2.5 px-3 bg-[#6349ed] hover:bg-[#523ad6] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer text-center relative overflow-hidden"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-300 animate-bounce" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-purple-200" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
