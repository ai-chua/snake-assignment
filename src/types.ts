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

export interface Tick {
  velX: number;
  velY: number;
}