import express from "express";
import Product from "../models/product.js";
import category from "../models/category.js";
import User from "../models/user.js";
import CapitalizeWords from "../utils/capitalizeWords.js";

const productRouter = express.Router();

//to post product
productRouter.post("/products", async (req, res) => {
  try {
    // To caplitalize name. P.s. incase of patch/put requests same should be done to maintain consistency
    const productData = { ...req.body };
    productData.name = CapitalizeWords(productData.name);

    const product = new Product(productData);
    const savedProduct = await product.save();
    console.log("product details are", savedProduct);

    res.status(201).json(savedProduct);
  } catch (err) {
    console.log("error while adding the product", err);

    res.status(400).json({ error: err.message });
  }
});

//to get all product
productRouter.get("/products", async (req, res) => {
  try {
    let products;
    if (req.query?.sellerId) {
      products = await Product.find({ sellerId: req.query?.sellerId })
        .sort({ createdAt: -1 }) //sort the products based on their created at and decending order
        .populate("sellerId", "name email phoneNumber");
    } else if (req.query.name) {
      const searchRegex = new RegExp(req.query.name, "i");
      products = await Product.find({ name: searchRegex })
        .populate("sellerId")
        .populate("category");
    } else if (req.query.userId) {
      const user = await User.findById(req.query.userId);
      const allProducts = await Product.find().populate("sellerId category");
      products = allProducts.filter((item) => {
        return user.userPreferences.includes(item.category._id);
      });
    } else {
      products = await Product.find().populate("sellerId").populate("category");
    }
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

productRouter.get("products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default productRouter;
