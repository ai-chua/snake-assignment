import { DEFAULT_STARTING_POSITION } from "./consts";
import { GameState, ValidateCurrentSessionResponse, ValidateParams } from "./types"

// types of inputs should already be correct, checked at api and returned appropriate response
export function generateNewGameState({ width, height }: {
  width: number,
  height: number
}): GameState {
  // must be at least 2x2 to be able to make single unit move along either X or Y axis
  if (width < 3 && height < 3) {
    throw new Error('Invalid game board dimension')
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
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
  previousPositionY,
  previousVelX,
  previousVelY,
} : {
  width: number;
  height: number;
  velX: number;
  velY: number;
  previousPositionX: number;
  previousPositionY: number;
  previousVelX: number;
  previousVelY: number;
}) : {
  movement: boolean;
  withinBoundaries: boolean;
} {
  // Check if the movement is valid:
  // 1. The snake must only move along one axis per tick (either x or y, but not both).
  // 2. The velocity in each direction should be -1, 0, or 1.
  // 3. Should not have no movements
  const noMovement = velX === 0 && velY === 0
  const movedAlongX = velY === 0 && (velX === 1 || velX === -1)
  const movedAlongY = velX === 0 && (velY === 1 || velY === -1)

  // Check if the new movement is reversing the previous movement
  const isReversing = (velX === -previousVelX && velY === -previousVelY);

  const isValidMovement = !noMovement && !isReversing && (movedAlongY || movedAlongX)

  // Calculate the new position
  const newPositionX = previousPositionX + velX
  const newPositionY = previousPositionY + velY

  // Check if the new position is within the game boundaries
  const isWithinBoundaries = (
    newPositionX >= 0 && newPositionX <= width &&
    newPositionY >= 0 && newPositionY <= height
  )

  return {
    movement: isValidMovement,
    withinBoundaries: isWithinBoundaries
  }
}

export function validateCurrentSession(gameState: ValidateParams): ValidateCurrentSessionResponse
{
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

  const validateTickResult = {
    withinBoundaries: true,
    movement: true
  }

  for (let i = 0; i < ticks.length; i++) {
    const { velX, velY } = ticks[i]
    // assumption no 2, please find on README
    const previousVelX = i === 0 ? 0 : ticks[i - 1].velY
    const previousVelY = i === 0 ? 0 : ticks[i - 1].velY
    
    const outcome = validateTick({
      width,
      height,
      velX,
      velY,
      previousPositionX: currentSnakePositionX,
      previousPositionY: currentSnakePositionY,
      previousVelX,
      previousVelY
    })

    const attrs = ["withinBoundaries", "movement"]
    
    attrs.forEach((attr) => {
      // if previous result is true, but outcome is false
      if (validateTickResult[attr] && !outcome[attr]) {
        validateTickResult[attr] = outcome[attr]
      }
    })

    currentSnakePositionX += velX
    currentSnakePositionY += velY
  }

  const tickOnFruitPositionX = fruitPositionX === currentSnakePositionX
  const tickOnFruitPositionY = fruitPositionY === currentSnakePositionY
  const caughtFruit = tickOnFruitPositionX && tickOnFruitPositionY

  const updatedSnakePos = {
    x: currentSnakePositionX,
    y: currentSnakePositionY
  }

  console.log('updatedSnakePos', JSON.stringify(updatedSnakePos, null, 2))

  const { movement, withinBoundaries } = validateTickResult
  const isGamePlayValid = withinBoundaries && movement
  
  if (isGamePlayValid && caughtFruit) {
    return {
      canContinue: true,
      updatedScore: score + 1,
      updatedSnakePos
    }
  }

  // all ok, just no fruit 
  if (isGamePlayValid) {
    return {
      canContinue: false,
      updatedScore: score,
      updatedSnakePos
    }
  }

  // all the fails come through
  return {
    canContinue: false,
    updatedScore: score,
    updatedSnakePos
  }
}