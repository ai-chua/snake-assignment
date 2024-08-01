import * as chai from "chai"
import { generateNewGameState, validateCurrentSession, validateTick } from "../src/game_helpers"
import { State } from "../src/types"
import { DEFAULT_STARTING_POSITION } from "../src/consts"

const { expect } = chai

describe("generateNewGameState unit test", () => {
  it('should throw when both provided input(s) are smaller than 2', () => {
    expect(
      () => generateNewGameState({ width: 1, height: 1})
    ).to.throw('Invalid game board dimension')
  })

  it("should return output with required attributes",() => {
    const width = 3
    const height = 4

    const output: State = generateNewGameState({ width, height })

    expect(output).to.have.property('width', width).that.is.a('number')
    expect(output).to.have.property('height', height).that.is.a('number')
    expect(output).to.have.property('score', 0).that.is.a('number')

    expect(output).to.have.property('snake').that.is.an('object')
    expect(output.snake).to.have.property('x', DEFAULT_STARTING_POSITION.x)
    expect(output.snake).to.have.property('y', DEFAULT_STARTING_POSITION.y)
    
    expect(output.fruit).to.have.property('x').that.is.a('number')
    expect(output.fruit).to.have.property('y').that.is.a('number')

    expect(output).to.have.property('fruit').that.is.an('object')
    expect(output.fruit).to.have.property('x').that.is.a('number')
    expect(output.fruit).to.have.property('y').that.is.a('number')
  })
})

describe("validateTick unit test: for  direction and velocity", () => {
  // Check if the movement is valid:
  // 1. The snake must only move along one axis per tick (either x or y, but not both).
  // 2. The velocity in each direction should be -1, 0, or 1.
  it("Should return false: Invalid movement, within boundaries", () => {
    // Diagonal movement
    const res1 = validateTick({
      width: 10,
      height: 10, 
      velX: 1, 
      velY: 1, 
      previousPositionX: 5, 
      previousPositionY: 5 
    })

    // Moves more than one unit
    const res2 = validateTick({ 
      width: 10, 
      height: 10, 
      velX: 2, 
      velY: 0, 
      previousPositionX: 5, 
      previousPositionY: 5
    })

    expect(res1).to.deep.equal(false)
    expect(res2).to.deep.equal(false)
  })

  // Check if the new position is within the game boundaries
  it("Should return false: Valid movement, outside of boundaries", () => {
    // Moves out of bounds on X axis
    const res1 = validateTick({
      width: 10,
      height: 10,
      velX: 1,
      velY: 0,
      previousPositionX: 10,
      previousPositionY: 5
    })

    // Moves out of bounds on Y axis
    const res2 = validateTick({
      width: 10,
      height: 10,
      velX: 0,
      velY: 1,
      previousPositionX: 5,
      previousPositionY: 10
    })

    expect(res1).to.deep.equal(false)
    expect(res2).to.deep.equal(false)
  })

  // Both invalid, lol
  it("Should return false since neither movement nor boundary condition met", () => {
    const res1 = validateTick({ 
      width: 2, 
      height: 3, 
      velX: 1, 
      velY: 1, 
      previousPositionX: 3, 
      previousPositionY: 4 
    })

    expect(res1).to.deep.equal(false)
  })

  it("Should return true: Both conditions met", () => {
    // Valid move to the right within bounds
    const res1 = validateTick({ 
      width: 10, 
      height: 10, 
      velX: 1, 
      velY: 0, 
      previousPositionX: 5, 
      previousPositionY: 5
    })

    // Valid move upward within bounds
    const res2 = validateTick({
      width: 10,
      height: 10,
      velX: 0,
      velY: -1,
      previousPositionX: 5,
      previousPositionY: 5
    })

    expect(res1).to.deep.equal(true)
    expect(res2).to.deep.equal(true)
  })
})

describe('validateCurrentSession unit test', () => {
  it("should return valid=false: valid movement, out of bound", () => {
    const gameState = {
      ticks: [
        { velX: 1, velY: 0 }, // Moves the snake right x4,y0
        { velX: 1, velY: 0 }, // Moves the snake right x5,y0
        { velX: -1, velY: 0 }, // Moves the snake left x4,y0
        { velX: 0, velY: -1 }, // Moves the snake right x4, y-1
      ],
      width: 10,
      height: 10,
      score: 3,
      snake: { x: 3, y: 0 },
      fruit: { x: 4, y: 8 },
      gameId: 'test-game-1',
    }

    const result = validateCurrentSession(gameState)
    expect(result.valid).to.deep.equal(false)
    expect(result.updatedScore).to.deep.equal(3)
  })

  it("should return valid=false: invalid movement, within boundary", () => {
    const gameState1 = {
      ticks: [
        { velX: 1, velY: 0 }, // Moves the snake right
        { velX: 1, velY: 0 }, // Moves the snake right
        { velX: 0, velY: 0 }, // Invalid movement (no movement)
      ],
      width: 10,
      height: 10,
      score: 0,
      snake: { x: 0, y: 0 },
      fruit: { x: 4, y: 8 },
      gameId: 'test-game-1',
    };

    const res1 = validateCurrentSession(gameState1)

    expect(res1.valid).to.deep.equal(false)
    expect(res1.updatedScore).to.deep.equal(0)

    const gameState2 = {
      ticks: [
        { velX: 1, velY: 0 }, // Moves the snake right
        { velX: 1, velY: 0 }, // Moves the snake right
        { velX: 1, velY: 1 }, // diagonal movement
      ],
      width: 6,
      height: 8,
      score: 5,
      snake: { x: 1, y: 3 },
      fruit: { x: 8, y: 5 },
      gameId: 'test-game-2',
    };

    const res2 = validateCurrentSession(gameState2)

    expect(res2.valid).to.deep.equal(false)
    expect(res2.updatedScore).to.deep.equal(5)

    const gameState3 = {
      ticks: [
        { velX: 1, velY: 0 }, // Moves the snake right
        { velX: 1, velY: 0 }, // Moves the snake right
        { velX: 2, velY: 0 }, // more than 1 unit
      ],
      width: 6,
      height: 8,
      score: 4,
      snake: { x: 1, y: 3 },
      fruit: { x: 2, y: 5 },
      gameId: 'test-game-3',
    };

    const res3 = validateCurrentSession(gameState3)

    expect(res3.valid).to.deep.equal(false)
    expect(res3.updatedScore).to.deep.equal(4)
  })

  it("should return valid=true: valid movement, within boundary", () => {
    const gameState = {
      ticks: [
        { velX: 1, velY: 0 }, // Moves the snake right
        { velX: 1, velY: 0 }, // Moves the snake right
        { velX: 1, velY: 0 }, // Moves the snake right
        { velX: 1, velY: 0 }, // Moves the snake right
        { velX: 1, velY: 0 }, // Moves the snake right
        { velX: 1, velY: 0 }, // Moves the snake right
        { velX: 0, velY: 1 }, // Moves the snake down
        { velX: 0, velY: 1 }, // Moves the snake down
        { velX: 0, velY: 1 }, // Moves the snake down
        { velX: 0, velY: 1 }, // Moves the snake to fruit position
      ],
      width: 10,
      height: 10,
      score: 0,
      snake: { x: 0, y: 0 },
      fruit: { x: 6, y: 4 },
      gameId: 'test-game-3',
    };

    const res = validateCurrentSession(gameState)

    expect(res.valid).to.be.true;
    expect(res.updatedScore).to.equal(1) 
  })
})