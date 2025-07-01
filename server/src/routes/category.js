import { Router } from "express";
import Category from "../models/category.js";
import multer from "multer"
const categoryRoute = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() +file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


categoryRoute.post('/category',upload.single('categoryImage'),async (req,res)=>{
    req.body.image  = req.file?.filename;
    const category = await Category.create(req.body)
    res.send({message: 'Category added sucessfully',category})
})

categoryRoute.get('/category',async (req,res)=>{
    const category = await Category.find(req.body)
    res.send(category)
})
categoryRoute.delete('/category/:categoryId',async(req,res)=>{
    const deleteCategory = await Category.findByIdAndDelete(req.params.categoryId)
    res.send(deleteCategory)
})
export default categoryRoute