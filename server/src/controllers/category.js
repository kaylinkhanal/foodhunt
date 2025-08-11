import category from "../models/category.js";
import CapitalizeWords from "../utils/capitalizeWords.js";

 const addNewCategories= async (req, res) => {
  try {
    const { name, description, emoji } = req.body;
    const category = new category({
      name: CapitalizeWords(name),
      description,
      emoji,
    });
    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
}


const getAllCategories = async (req, res) => {
    try {
      const data = await category.find().sort({ createdAt: -1 });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }


  const getProductsByCategoryId= async (req, res) => {
    try {
      const data = await Product.find({category: req.params.categoryId})
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
export { addNewCategories ,getAllCategories,getProductsByCategoryId};