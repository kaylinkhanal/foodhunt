import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const saltRounds = 10;
import User from "../models/user.js";
import sendEmail from "../utils/sendEmail.js";
const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  //step  1 Check if the email already exists
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.send("Email already taken");
  else {
    //step 2: Hash the password
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    // step 3: Create the user in the db
    User.create(req.body);
  }
  return res.send("user registered");
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // ---step 1: email should exist
  const user = await User.findOne({ email: email });
  // --- no: return email not found
  if (!user) return res.send({ message: "Email not found" });

  // ---yes:
  // step 2: check if password matches to that of db
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) return res.send({ message: "Invalid password" });

  const token = await jwt.sign({ email: email }, process.env.JWT_SECRET);

  return res.send({
    message: "logged in successfully",
    user: user,
    isLoggedIn: true,
    token,
  });
});

userRouter.get("/users", async (req, res) => {
  let data;
  if (req.query.role) {
    data = await User.find({ role: req.query.role, isApproved: false });
  } else {
    data = await User.find();
  }
  return res.send(data);
});

export default userRouter;
