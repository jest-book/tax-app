import express from 'express'

import calcTaxHandler from './calcTaxHandler'

const app = express()

app.use(express.json())

app.use(calcTaxHandler)

export default app
