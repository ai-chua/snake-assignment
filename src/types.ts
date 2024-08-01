export interface State {
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

export type NewGameState = State & {
  gameId: string
}
export interface Tick {
  velX: number;
  velY: number;
}

export type ValidateParams = NewGameState & {
  ticks: Tick[]
} 

export type Snake = {
  x: number;
  y: number;
} & Tick

export interface ValidateCurrentSessionResponse {
  valid: boolean;
  updatedScore: number;
}