import express from "express";
import Product from "../models/product.js";
import category from "../models/category.js";
import User from "../models/user.js";
import CapitalizeWords from "../utils/capitalizeWords.js";
import runPrompt from "../utils/generalizeChipName.js";
const productRouter = express.Router();
import multer   from 'multer'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

//to post product
productRouter.post("/products", upload.single('uplodedFiles'), async (req, res) => {
  try {
    // To caplitalize name. P.s. incase of patch/put requests same should be done to maintain consistency
    const productData = { ...req.body };
    productData.name = CapitalizeWords(productData.name);
    productData.imageName = req.file?.filename 
    const product = new Product(productData);
    const savedProduct = await product.save();

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


productRouter.get("products/category/:categoryId", async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

productRouter.get("/product-chips", async (req, res) => {
  let product
  if(req.query.categoryId) {
     product = await Product.find({category: req.query.categoryId}).select("_id name category");
  }else{
     product = await Product.find().select("_id name category");

  }
  if(product.length == 0) return res.json([])
  const productChipInfo = await runPrompt(product);
  res.json(productChipInfo);
});





productRouter.get("/product-search", async (req, res) => {

  const matchedProducts = await Product.find({
    _id: { $in: req.query?.productIds?.split(',')}
}).populate('sellerId category')
  res.json(matchedProducts)
})


export default productRouter;


