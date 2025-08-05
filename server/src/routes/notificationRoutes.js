// routes/notificationRoutes.js
import express from "express";
import Notification from "../models/notification.js";

const notificationRouter = express.Router();

notificationRouter.get("/notification/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    const notifications = await Notification.find({ receiverId: sellerId })
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
});

export default notificationRouter;
