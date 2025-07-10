import { Router } from "express";
import Order from "../models/order.js";

const orderRouter = Router();

orderRouter.post("/orders", async (req, res) => {
  const { bookedById, productId, quantity, paymentMethod } = req.body;

  if (!bookedById || !productId || !quantity) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  // Assuming you have an Order model
  const order = new Order({
    bookedById,
    productId,
    quantity,
    paymentMethod,
  });

  await order.save();

  res.send({ message: "Order placed successfully", order });
});

orderRouter.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("productId", "name discountedPrice");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default orderRouter;
