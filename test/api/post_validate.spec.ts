import { Application } from 'express'
import { appFactory } from '../../src/utilities/app'
import request from 'supertest'
import { getRedisInstance } from '../../src/utilities/redis_client'
import { State } from '../../src/types'
import { validateCurrentGame } from '../../src/api/post_validate'

const gameState: State = {
  width: 4,
  height: 4,
  snake: {
    x: 2,
    y: 1,
  },
  fruit: {
    x: 4,
    y: 3,
  },
  score: 2,
  gameId: 'matt-damon',
}

describe('POST /validate endpoint', () => {
  let app: Application
  const url = '/validate'

  before(() => {
    app = appFactory()
    app.post(url, validateCurrentGame)
  })

  afterEach(async () => {
    // delete all
    await getRedisInstance()
      .flushall()
      .then()
      .catch((err) => {
        console.log('error')
      })
  })

  it("should return 400 if user's gameId is invalid", async () => {
    await getRedisInstance().set(gameState.gameId, JSON.stringify(gameState))

    const reqBody = {
      ...gameState,
      ticks: [
        // 2 , 1 > goal: 4 , 3
        { velX: 1, velY: 0 }, // 3, 1
        { velX: 0, velY: 1 }, // 3, 2
        { velX: 0, velY: 1 }, // 3, 3
        { velX: 1, velY: 0 }, // 4, 3 gets fruit
      ],
      gameId: 'donald-trump',
    }

    await request(app)
      .post(url)
      .send(reqBody)
      .expect(400, {
        success: false,
        error: {
          code: 400,
          message: 'Invalid gameId',
        },
      })
  })

  it('should return 418 if user is game over', async () => {
    await getRedisInstance().set(gameState.gameId, JSON.stringify(gameState))

    const reqBody = {
      ...gameState,
      ticks: [
        // 2 , 1 > goal: 4 , 3
        { velX: 1, velY: 0 }, // 3, 1
        { velX: 0, velY: 1 }, // 3, 2
        { velX: 0, velY: 1 }, // 3, 3
        { velX: 0, velY: 1 }, // 3, 4
        { velX: 0, velY: 1 }, // 3, 5 out of bound
      ],
    }

    await request(app)
      .post(url)
      .send(reqBody)
      .expect(418, {
        score: reqBody.score,
        error: {
          code: 418,
          message: 'Game over!',
        },
      })
  })

  it('should return 200 if user can continue', async () => {
    await getRedisInstance().set(gameState.gameId, JSON.stringify(gameState))

    const reqBody = {
      ...gameState,
      ticks: [
        // 2 , 1 > goal: 4 , 3
        { velX: 1, velY: 0 }, // 3, 1
        { velX: 0, velY: 1 }, // 3, 2
        { velX: 0, velY: 1 }, // 3, 3
        { velX: 1, velY: 0 }, // 4, 3 fruit
      ],
    }

    await request(app).post(url).send(reqBody).expect(200)
  })
})
