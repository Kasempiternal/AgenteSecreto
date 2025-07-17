import { Card, CardType, Team, GridLayout } from './types';
import { getRandomWords } from './words';

export function generateGridLayout(startingTeam: Team): GridLayout {
  return {
    red: startingTeam === 'red' ? 9 : 8,
    blue: startingTeam === 'blue' ? 9 : 8,
    neutral: 7,
    assassin: 1
  };
}

export function generateCards(startingTeam: Team): Card[] {
  const words = getRandomWords(25);
  const layout = generateGridLayout(startingTeam);
  
  // Create array of card types
  const types: CardType[] = [
    ...Array(layout.red).fill('red'),
    ...Array(layout.blue).fill('blue'),
    ...Array(layout.neutral).fill('neutral'),
    ...Array(layout.assassin).fill('assassin')
  ];
  
  // Shuffle types
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }
  
  // Create cards
  return words.map((word, index) => ({
    word,
    type: types[index],
    revealed: false,
    index
  }));
}

export function getRandomStartingTeam(): Team {
  return Math.random() < 0.5 ? 'red' : 'blue';
}

export function checkWinner(cards: Card[]): Team | null {
  const redCards = cards.filter(c => c.type === 'red' && !c.revealed).length;
  const blueCards = cards.filter(c => c.type === 'blue' && !c.revealed).length;
  
  if (redCards === 0) return 'red';
  if (blueCards === 0) return 'blue';
  
  return null;
}

export function getRemainingCards(cards: Card[], team: Team): number {
  return cards.filter(c => c.type === team && !c.revealed).length;
}