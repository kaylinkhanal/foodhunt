import {Router} from "express";
import  Category from "../models/category.js";


const categoryrouter = Router();

categoryrouter.post("/categories",async (req, res) => {
  try {
    const { name, description } = req.body;
      const category= new Category({
      name,
      description,
    });
    await category.save();
    res.status(201).json({ message: "category created", category });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error", error });
  }
});
categoryrouter.get("/categories",async (req, res) => {
  try {
    const data = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

categoryrouter.delete("/categories/:id",async (req, res) => {
  try {
    const data = await Category.findByIdAndDelete(req.params.id)
    res.status(200).json({msg: "Deleted success!!"});
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
export default categoryrouter;
