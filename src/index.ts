import { Application } from 'express'
import { appFactory } from './utilities/app'
import { PORT } from './consts'

import { startNewGame } from './api/get_new'
import { validateCurrentGame } from './api/post_validate'

const app: Application = appFactory()

app.get('/new', startNewGame)
app.post('/validate', validateCurrentGame)

app.listen(PORT, () => {
    console.log(`Snake server up on port ${PORT}`)
})