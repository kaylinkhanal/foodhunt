import express from 'express'
import connect from './db/connect.js'
const app = express()
const port = 8000
connect()
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})