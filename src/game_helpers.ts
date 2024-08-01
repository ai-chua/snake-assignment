import { DEFAULT_STARTING_POSITION, VALID_VELOCITY } from "./consts";
import { State, ValidateParams } from "./types"

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

export function validateTick({
  width,
  height,
  velX,
  velY,
  previousPositionX,
  previousPositionY
} : {
  width: number;
  height: number;
  velX: number;
  velY: number;
  previousPositionX: number;
  previousPositionY: number;
}): boolean {
  // Check if the movement is valid:
  // 1. The snake must only move along one axis per tick (either x or y, but not both).
  // 2. The velocity in each direction should be -1, 0, or 1.
  // 3. Should not have no movements
  const noMovement = velX === 0 && velY === 0
  const movedAlongX = velY === 0 && (velX === 1 || velX === -1)
  const movedAlongY = velX === 0 && (velY === 1 || velY === -1)

  const isValidMovement = !noMovement && (movedAlongY || movedAlongX)

  // Calculate the new position
  const newPositionX = previousPositionX + velX
  const newPositionY = previousPositionY + velY

  // Check if the new position is within the game boundaries
  const isWithinBoundaries = (
    newPositionX >= 0 && newPositionX <= width &&
    newPositionY >= 0 && newPositionY <= height
  )

  // Both conditions must be true for the movement to be valid
  return isValidMovement && isWithinBoundaries
}

export function validateCurrentSession(gameState: ValidateParams): {
  valid: boolean;
  updatedScore: number;
} {
  console.log('gameState', gameState)
  const {
    ticks,
    height,
    width,
    score,
    snake: {
      x: lastSnakePosX,
      y: lastSnakePosY
    },
    fruit: {
      x: fruitPositionX,
      y: fruitPositionY
    }
  } = gameState

  let currentSnakePositionX = lastSnakePosX
  let currentSnakePositionY = lastSnakePosY

  let isValidSetOfTicks = true

  for (let i = 0; i < ticks.length; i++) {
    const { velX, velY } = ticks[i]
    
    isValidSetOfTicks = validateTick({
      width,
      height,
      velX,
      velY,
      previousPositionX: currentSnakePositionX,
      previousPositionY: currentSnakePositionY
    })
    
    currentSnakePositionX += velX
    currentSnakePositionY += velY

    // end loop early if  single tick is invalid cos why bother w the rest lol
    if (!isValidSetOfTicks ) {
      isValidSetOfTicks = false
      return {
        valid: false,
        updatedScore: score
      } 
    }
    // else, continue until Ticks is invalid
  }

  console.log('snake final pos', 'x', currentSnakePositionX, 'y', currentSnakePositionY)

  console.log('fruit', 'x', fruitPositionX, 'y', fruitPositionY)

  const tickOnFruitPositionX = fruitPositionX === currentSnakePositionX
  const tickOnFruitPositionY = fruitPositionY === currentSnakePositionY
  const caughtFruit = tickOnFruitPositionX && tickOnFruitPositionY

  const isValidSessionPlay = isValidSetOfTicks && caughtFruit

  let updatedScore = score
  
  if (isValidSessionPlay) {
    updatedScore++
  }

  console.log('updatedScore', updatedScore)

  return {
    valid: isValidSessionPlay,
    updatedScore,
  }
}