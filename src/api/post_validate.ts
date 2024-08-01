import { Request, Response } from "express";
import { getRedisInstance } from "../utilities/redis_client";
import { State, ValidateParams } from "../types";
import { validateCurrentSession } from "../game_helpers";

export async function validateCurrentGame(req: Request, res: Response): Promise<Response> {
  try {
    const { gameId, ticks } = req.body as ValidateParams

    const gameState = await getRedisInstance()
      .get(gameId)
      .then(result => {
        return JSON.parse(result)
      })
      .catch(error => {
        console.log('Unexpected redis error', error)
        throw new Error()
      })

    if (gameState === null) {
      throw new Error('Invalid gameId')
    }

    const result = validateCurrentSession({...gameState, ticks})

    const { valid, updatedScore } = result

    // update redis

    // generate new

    return res.status(200).json({
      result
    })
  } catch (error) {
    console.log('error', error.message)
    if (error.message) {
      return res.status(400)
      .json({
        success:false,
        error: {
          code: 400,
          message: error.message
        }
      })
    }

    // all other unexpected errors
    return res.status(500).json({
        success: false,
        error: {
          code: 500,
          message: 'Internal server error'
        }
      })
  }
}
export { validateCurrentSession };

