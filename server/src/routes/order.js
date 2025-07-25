import { Router } from "express";
import Order from "../models/order.js";
import Product from "../models/product.js";

const orderRouter = Router();

orderRouter.post("/orders", async (req, res) => {
  const { bookedById, productId, quantity, paymentMethod, price } = req.body;

  if (!bookedById || !productId || !quantity) {
    return res.status(400).send({ message: "Missing required fields" });
  }
  const product = await Product.findById(productId);
  product.availableQuantity -= quantity;
  await product.save();
  // Assuming you have an Order model
  const order = new Order({
    bookedById,
    productId,
    quantity,
    paymentMethod,
    price,
  });

  await order.save();

  res.send({ message: "Order placed successfully", order });
});

orderRouter.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("bookedById", "name email")
      .populate("productId", "name discountedPrice")
      .skip((req.query.page - 1) * req.query.pageSize)
      .limit(req.query.pageSize);
    res.status(200).json(orders);
  } catch (error) {
    console.log("error while getting orders", error);

    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

orderRouter.get("/orders/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
      .populate("bookedById", "name email")
      .populate("productId", "name discountedPrice");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({
      data: order,
      message: "Successfully fetched order",
    });
  } catch (error) {
    next(error);
  }
});

orderRouter.get("/orders/:userId", async (req, res) => {
  const orders = await Order.find({ bookedById: req.params.userId }).populate({
    path: "productId",
    populate: {
      path: "sellerId",
      model: "User",
    },
  });

  res.json(orders);
});

orderRouter.patch("/orders/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      res.status(400).json({ message: "order not found" });
    }
    //only pending and booked status order can be cancelled
    if (order.status !== "pending" && order.status !== "booked") {
      res.status(400).json({
        message: `order can not be cancelled on ${order.status} status.`,
      });
    }
    order.status = "Cancelled";
    await order.save();

    //updating product available quantity
    await Product.findByIdAndUpdate(
      order.productId,
      { $inc: { availableQuantity: order.quantity } },
      { new: true }
    );

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "error while cancelling order" });
  }
});

export default orderRouter;
