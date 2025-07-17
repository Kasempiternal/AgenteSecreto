export type CardType = 'red' | 'blue' | 'neutral' | 'assassin';
export type GamePhase = 'start' | 'leader-view' | 'playing' | 'game-over';
export type Team = 'red' | 'blue';

export interface Card {
  word: string;
  type: CardType;
  revealed: boolean;
  index: number;
}

export interface GameState {
  cards: Card[];
  currentTeam: Team;
  redScore: number;
  blueScore: number;
  phase: GamePhase;
  winner: Team | null;
  startingTeam: Team;
  showingLeaderView: boolean;
}

export interface GridLayout {
  red: number;
  blue: number;
  neutral: number;
  assassin: number;
}