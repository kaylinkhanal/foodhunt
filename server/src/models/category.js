<<<<<<< HEAD

// models/TooGoodToGoRestaurant.js
import mongoose from 'mongoose';
=======
// models/TooGoodToGoRestaurant.js
import mongoose from "mongoose";
>>>>>>> d22d641 (feat: user preferences)
const { Schema } = mongoose;

const categoryschema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    emoji: {
      type: String,
      default: "🍲",
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("category", categoryschema);
