export interface GameState {
  width: number;
  height: number;
  snake: {
    x: number,
    y: number
  };
  fruit: {
    x: number,
    y: number
  };
  score: number;
}

export type State = GameState & {
  gameId: string
}
export interface Tick {
  velX: number;
  velY: number;
}

export type ValidateParams = State & {
  ticks: Tick[]
} 

export type Snake = {
  x: number;
  y: number;
} & Tick

export interface ValidateCurrentSessionResponse {
  canContinue: boolean;
  updatedScore: number;
  updatedSnakePos: {
    x: number,
    y: number
  }
}