import { Router } from "express";
import Order from "../models/order.js";

const orderRouter = Router();

orderRouter.post("/orders", async (req, res) => {
  try {
    const { userId, productId, quantity, paymentMethod } = req.body;

    const newOrder = new Order({
      userId,
      productId,
      quantity,
      paymentMethod,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
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
