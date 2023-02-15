import express from 'express'
import cors from 'cors'
import calcTaxHandler from './calcTaxHandler'

const app = express()

app.use(cors({ origin: 'http://localhost:3001' }))

app.use(express.json())

app.use(calcTaxHandler)

export default app
