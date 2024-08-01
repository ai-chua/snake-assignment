import { Request, Response } from "express";
import { v4 as uuid } from 'uuid';

import { generateNewGameState } from "../game_helpers";

export function startNewGame(req: Request, res: Response): Response {
  try {
    const { w , h } = req.query
  
    // dont want anything other than strings
    if (typeof w !== 'string') {
      throw new Error("Invalid input provided")
    }

    if (typeof h !== 'string') {
      throw new Error("Invalid input provided")
    }

    const width = parseInt(w, 10)
    const height = parseInt(h, 10)

    const newGame = generateNewGameState({ width, height })
    const gameId = uuid()
    
    return res
      .status(200)
      .json({
        ...newGame,
        gameId
      })

  } catch (error) {
    // catch expected errors
    if (error.message) {
      return res.status(400).json({
        success: false,
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