import express from "express";
import connect from "./db/connect.js";
import cors from "cors";
import userRouter from "./routes/user.js";
import kycRouter from "./routes/kyc.js";
import dotenv from "dotenv";
import productRouter from "./routes/product.js";
import orderRouter from "./routes/order.js";
import categoryRouter from "./routes/category.js";

dotenv.config();

const port = process.env.PORT;
const app = express();
app.use('/images',express.static('uploads'));
connect();
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(kycRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(categoryRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
