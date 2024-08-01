import { Application } from 'express'
import { startNewGame } from './api/get_new'
import { appFactory } from './utilities/app'
import { PORT } from './consts'

const app: Application = appFactory()

app.get('/new', startNewGame)

app.listen(PORT, () => {
    console.log(`Snake server up on port ${PORT}`)
})