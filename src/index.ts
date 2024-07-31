import cors, { CorsRequest } from 'cors'
import express, { urlencoded,  Application } from 'express'
import { json } from 'body-parser'

const PORT = process.env.PORT || 3000

const app: Application = express()

app.use(cors<CorsRequest>())
app.options('*', cors<CorsRequest>())

app.use(urlencoded({ extended: true }))
app.use(json())

app.listen(PORT, () => {
  console.log(`Snake server up on port ${PORT}`)
})