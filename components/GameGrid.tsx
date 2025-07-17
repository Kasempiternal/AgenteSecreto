'use client';

import { Card } from '@/lib/types';
import GameCard from './GameCard';

interface GameGridProps {
  cards: Card[];
  onCardReveal: (index: number) => void;
  showColors: boolean;
  disabled: boolean;
}

export default function GameGrid({ cards, onCardReveal, showColors, disabled }: GameGridProps) {
  return (
    <div className="grid grid-cols-5 gap-2 w-full h-full max-w-4xl mx-auto p-2">
      {cards.map((card) => (
        <div key={card.index} className="aspect-[4/3]">
          <GameCard
            card={card}
            onReveal={onCardReveal}
            showColors={showColors}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
}