import { DEFAULT_STARTING_POSITION } from "./consts";
import { State } from "./types"

export function generateNewGameState({ width, height }: {
  width: number | null | undefined,
  height: number | null | undefined
}): State {
  if (typeof width !== 'number' || typeof height !== 'number') {
    throw new Error('Invalid input provided')
  }

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