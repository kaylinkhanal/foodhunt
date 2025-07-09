import { Router } from "express";
import Category from "../models/category.js";
import CapitalizeWords from "../utils/capitalizeWords.js";
import Product from "../models/product.js";

const categoryrouter = Router();

// POST - Create a new category
categoryrouter.post("/categories", async (req, res) => {
  try {
    const { name, description, emoji } = req.body;
    const category = new Category({
      name: CapitalizeWords(name),
      description,
      emoji,
    });
    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// GET - Get all categories
categoryrouter.get("/categories", async (req, res) => {
  try {
    const data = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


categoryrouter.get("/categories/:categoryId/products", async (req, res) => {
  try {
    const data = await Product.find({category: req.params.categoryId})
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// DELETE - Delete a category
categoryrouter.delete("/categories/:id", async (req, res) => {
  try {
    const result = await Category.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// PATCH - Update a category
categoryrouter.patch("/categories/:id", async (req, res) => {
  try {
    const categoryToUpdate = await Category.findById(req.params.id);

    if (!categoryToUpdate) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update all fields from the request body
    for (let key in req.body) {
      if (key === "name") {
        categoryToUpdate[key] = CapitalizeWords(req.body[key]);
      } else {
        categoryToUpdate[key] = req.body[key];
      }
    }

    await categoryToUpdate.save();
    res.status(200).json({
      message: "Category updated successfully",
      category: categoryToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default categoryrouter;
