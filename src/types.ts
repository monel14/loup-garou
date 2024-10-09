export interface Card {
  id: number;
  name: string;
  role: string;
  description: string;
}

export interface Player {
  id: number;
  name: string;
  card: Card | null;
  isAlive: boolean;
}

export interface GameState {
  players: Player[];
  phase: 'setup' | 'night' | 'day' | 'voting' | 'end';
  round: number;
}