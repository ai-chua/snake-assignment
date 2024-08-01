import { Application, Request, Response, NextFunction } from 'express'
import { appFactory } from './utilities/app'
import { PORT } from './consts'

import { startNewGame } from './api/get_new'
import { validateCurrentGame } from './api/post_validate'

const app: Application = appFactory()

app.get('/new', startNewGame)
app.post('/validate', validateCurrentGame)

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(405).send({ error: 'Method Not Allowed' })
})

app.listen(PORT, () => {
  console.log(`Snake server up on port ${PORT}`)
})
