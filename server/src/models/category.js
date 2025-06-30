
// models/TooGoodToGoRestaurant.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const categoryschema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
    },
    description: {
      type: String,
    },
    availableMeals: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('category', categoryschema);
