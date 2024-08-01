import { DEFAULT_STARTING_POSITION } from "./consts";
import { State } from "./types"

// types of inputs should already be correct, checked at api and returned appropriate response
export function generateNewGameState({ width, height }: {
  width: number,
  height: number
}): State {

  if (width === 1 && height === 1) {
    throw new Error('Invalid game board dimension')
  }

  return {
    width,
    height,
    snake: DEFAULT_STARTING_POSITION,
    fruit: {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    },
    score: 0,
  };
}