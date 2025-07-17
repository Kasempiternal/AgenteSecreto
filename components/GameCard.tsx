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
    if (!card.revealed && !showColors) return 'bg-white border-2 border-gray-300';
    
    switch (card.type) {
      case 'red':
        return 'bg-red-500 text-white border-red-600';
      case 'blue':
        return 'bg-blue-500 text-white border-blue-600';
      case 'neutral':
        return 'bg-gray-400 text-white border-gray-500';
      case 'assassin':
        return 'bg-black text-white border-gray-900';
      default:
        return 'bg-white border-gray-300';
    }
  };

  const getLeaderBorder = () => {
    if (!showColors || card.revealed) return '';
    
    switch (card.type) {
      case 'red':
        return 'ring-4 ring-red-500 ring-inset';
      case 'blue':
        return 'ring-4 ring-blue-500 ring-inset';
      case 'neutral':
        return 'ring-4 ring-gray-400 ring-inset';
      case 'assassin':
        return 'ring-4 ring-black ring-inset';
      default:
        return '';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || card.revealed}
      className={`
        relative w-full h-full rounded-lg shadow-md transition-all duration-300
        ${getCardColor()}
        ${getLeaderBorder()}
        ${isFlipping ? 'card-flip' : ''}
        ${card.revealed && card.type === 'assassin' ? 'assassin-death' : ''}
        ${!disabled && !card.revealed ? 'hover:scale-105 active:scale-95' : ''}
        ${disabled || card.revealed ? 'cursor-not-allowed' : 'cursor-pointer'}
        flex items-center justify-center p-2
      `}
    >
      <span className={`
        text-center font-bold
        ${card.revealed || showColors ? 'text-sm sm:text-base' : 'text-xs sm:text-sm text-gray-800'}
        ${card.revealed ? 'opacity-60' : ''}
      `}>
        {card.word}
      </span>
    </button>
  );
}