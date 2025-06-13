import { Router } from "express"
import User from "../models/user.js"
const userRouter = Router()

userRouter.post('/register', (req, res) => {
    User.create(req.body)
    res.send('user registered')
  })

export default userRouter