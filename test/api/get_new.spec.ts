import { Application } from 'express'
import { appFactory } from '../../src/utilities/app'
import request from 'supertest'

import { startNewGame } from '../../src/api/get_new'

describe('GET /new endpoint', () => {
  let app: Application
  const url = '/new'

  beforeEach(() => {
    app = appFactory()
    app.get(url, startNewGame)
  })

  it('should return 400 if query parameter is any other types than string', async () => {
    await request(app)
      .get(url)
      .query({ w: ["4", "66"], h: "5"})
      .expect(400, {
          success: false,
          error: {
            code: 400,
            message: "Invalid input provided"
          }
        })
  })

  it('should return 400 if in violation of any game rules', async () => {
    await request(app)
      .get(url)
      .query({ w: "1", h: "1"})
      .expect(400, {
          success: false,
          error: {
            code: 400,
            message: "Invalid game board dimension"
          }
        })
  })

  it('should return 200 if start game conditions all met', async () => {
    await request(app)
      .get(url)
      .query({ w: "14", h: "12"})
      .expect(200)
      .then(res => {
        console.log(res.body)
      })
  })
})
