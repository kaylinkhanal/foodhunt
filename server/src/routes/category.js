import {Router} from "express";
import  category from "../models/category.js";
import category from "../models/category.js";

const categoryrouter = Router();

categoryrouter.post("/category",async (req, res) => {
  try {
    const { name, location, contact, description, availableMeals } = req.body;
 const category=category({
      name,
      location,
      contact,
      description,
      availableMeals,
    });
    await category.save();
    res.status(201).json({ message: "category created", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
categoryrouter.get("/category",async (req, res) => {
  try {
    const restaurants = await category.find().sort({ createdAt: -1 });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
export default categoryrouter;
