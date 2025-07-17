export type CardType = 'red' | 'blue' | 'neutral' | 'assassin';
export type GamePhase = 'start' | 'mode-selection' | 'leader-view' | 'two-player-red-view' | 'two-player-blue-view' | 'playing' | 'game-over';
export type Team = 'red' | 'blue';
export type GameMode = 'normal' | 'two-player';

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
  gameMode: GameMode;
}

export interface GridLayout {
  red: number;
  blue: number;
  neutral: number;
  assassin: number;
}