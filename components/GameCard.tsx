'use client';

import { Card } from '@/lib/types';
import { useState } from 'react';

interface GameCardProps {
  card: Card;
  onReveal: (index: number) => void;
  showColors: boolean;
  disabled: boolean;
}

export default function GameCard({ card, onReveal, showColors, disabled }: GameCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleClick = () => {
    if (disabled || card.revealed) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      onReveal(card.index);
      setIsFlipping(false);
    }, 300);
  };

  const getCardColor = () => {
    if (!card.revealed && !showColors) return 'spy-card';
    
    switch (card.type) {
      case 'red':
        return 'bg-gradient-to-br from-red-600 to-red-800 text-white border-2 border-red-900 shadow-lg shadow-red-500/50';
      case 'blue':
        return 'bg-gradient-to-br from-blue-600 to-blue-800 text-white border-2 border-blue-900 shadow-lg shadow-blue-500/50';
      case 'neutral':
        return 'bg-gradient-to-br from-gray-500 to-gray-700 text-white border-2 border-gray-800';
      case 'assassin':
        return 'bg-black text-red-500 border-2 border-red-900 shadow-lg shadow-red-500/70';
      default:
        return 'spy-card';
    }
  };

  const getLeaderBorder = () => {
    if (!showColors || card.revealed) return '';
    
    switch (card.type) {
      case 'red':
        return 'ring-4 ring-red-500 ring-inset shadow-inner';
      case 'blue':
        return 'ring-4 ring-blue-500 ring-inset shadow-inner';
      case 'neutral':
        return 'ring-4 ring-gray-500 ring-inset shadow-inner';
      case 'assassin':
        return 'ring-4 ring-red-900 ring-inset shadow-inner animate-pulse';
      default:
        return '';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || card.revealed}
      className={`
        relative w-full h-full rounded-lg transition-all duration-300
        ${getCardColor()}
        ${getLeaderBorder()}
        ${isFlipping ? 'card-flip' : ''}
        ${card.revealed && card.type === 'assassin' ? 'assassin-death' : ''}
        ${!disabled && !card.revealed ? 'hover:scale-105 active:scale-95' : ''}
        ${disabled || card.revealed ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        ${card.revealed && (card.type === 'red' || card.type === 'blue') ? 'win-celebration' : ''}
        flex items-center justify-center p-2
        transform perspective-1000
      `}
    >
      <span className={`
        text-center font-bold uppercase tracking-wider
        ${card.revealed || showColors ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}
        ${card.revealed ? 'opacity-80' : ''}
        ${card.revealed && card.type === 'assassin' ? 'text-red-500 text-3xl animate-pulse' : ''}
      `}>
        {card.revealed && card.type === 'assassin' ? '☠️ ELIMINADO ☠️' : card.word}
      </span>
    </button>
  );
}