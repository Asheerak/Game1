export type WorldId = 'happiness' | 'fear' | 'anger' | 'hope';

export interface Level {
  id: WorldId;
  title: string;
  description: string;
  color: string;
  icon: string;
  unlocked: boolean;
  completed: boolean;
}

export interface GameState {
  currentWorld: WorldId | null;
  score: number;
  stars: number;
  completedWorlds: WorldId[];
  isGameOver: boolean;
}

export interface Scenario {
  id: number;
  text: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}
