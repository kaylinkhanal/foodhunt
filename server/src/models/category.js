// models/TooGoodToGoRestaurant.js
import mongoose from "mongoose";
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
  },
  { timestamps: true }
);

export default mongoose.model("Category", categoryschema);
