import { Router } from "express"
import bcrypt from "bcrypt"
const saltRounds = 10
import User from "../models/user.js"
const userRouter = Router()

userRouter.post('/register', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if(user) return res.send('Email already taken')
    else{
      req.body.password = await bcrypt.hash(req.body.password, saltRounds)
      User.create(req.body)
    }
    return res.send('user registered')
  })

  userRouter.get('/users', async (req, res) => {
    const data = await User.find()
    return res.send(data)
  })
export default userRouter