import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    bookedById: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled", "Booked"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Online"],
      default: "Cash",
    },
    price: Number,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
