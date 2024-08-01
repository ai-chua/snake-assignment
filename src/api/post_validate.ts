import { Request, Response } from 'express'
import { getRedisInstance } from '../utilities/redis_client'
import { GameState, ValidateParams } from '../types'
import { validateCurrentSession } from '../game_helpers'
import { MIN_IN_MS } from '../consts'

export async function validateCurrentGame(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { gameId, ticks, width, height, score, fruit } =
      req.body as ValidateParams

    const gameState = await getRedisInstance()
      .get(gameId)
      .then((result) => {
        return JSON.parse(result)
      })
      .catch((error) => {
        console.log('Unexpected redis error', error)
        throw new Error('')
      })

    if (gameState === null) {
      throw new Error('Invalid gameId')
    }

    const result = validateCurrentSession({ ...gameState, ticks })

    const { canContinue, updatedScore, updatedSnakePos } = result

    console.log('results', result)

    if (canContinue) {
      const updatedState: GameState = {
        width,
        height,
        snake: updatedSnakePos,
        // if user can continue but did not catch food in current round, fruit pos stays
        fruit:
          updatedScore === score
            ? fruit
            : {
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height),
              },
        score: updatedScore,
      }

      await getRedisInstance()
        .set(gameId, JSON.stringify(updatedState))
        .then((result) => {
          return result
        })
        .catch((error) => {
          console.log('Unexpected redis error', error)
          throw new Error()
        })

      console.log('hello done', updatedState)

      if (updatedScore === score) {
        return res.status(404).json({
          error: {
            code: 404,
            message: 'Fruit not found!',
          },
        })
      }

      return res.status(200).json({
        state: updatedState,
      })
    }

    await getRedisInstance()
      .del(gameId)
      .then()
      .catch((error) => {
        console.log('Unexpected redis error', error)
        throw new Error()
      })

    console.log('hello done')

    return res.status(418).json({
      score,
      error: {
        code: 418,
        message: 'Game over!',
      },
    })
  } catch (error) {
    console.log('error', error.message)
    if (error.message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: error.message,
        },
      })
    }

    // all other unexpected errors
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: 'Internal server error',
      },
    })
  }
}
