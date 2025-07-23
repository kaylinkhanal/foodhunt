import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String, // String is shorthand for {type: String}
  phoneNumber: String,
  name: String,
  role: String,
  avatar: String,
  password: String,
  userPreferences: [
    {
      type: String,
    },
  ],
  coords: {},
});
const User = mongoose.model("User", userSchema);
export default User;
