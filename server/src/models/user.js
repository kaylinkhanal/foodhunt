import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String, // String is shorthand for {type: String}
  phoneNumber: String,
  role: String,
  password: String,
  location: String

});
const User = mongoose.model('User', userSchema);
export default User;