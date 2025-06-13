import express from 'express'
import connect from './db/connect.js'
import cors from 'cors'
import userRouter from './routes/user.js'
const port = 8080
const app = express()

connect()
app.use(cors())
app.use(express.json()) 
app.use(userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})