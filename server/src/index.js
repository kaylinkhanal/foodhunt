import express from "express";
import connect from "./db/connect.js";
import cors from "cors";
import { createServer } from "http";
import userRouter from "./routes/user.js";
import kycRouter from "./routes/kyc.js";
import dotenv from "dotenv";
import productRouter from "./routes/product.js";
import orderRouter from "./routes/order.js";
import categoryRouter from "./routes/category.js";
import { Server } from "socket.io";
dotenv.config();

const port = process.env.PORT;
const app = express();
const httpServer = createServer(app);


const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on('order', (orderId)=>{
    io.emit('orderId', orderId);
  })
});

app.use('/images',express.static('uploads'));
connect();
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(kycRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(categoryRouter);

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


//  web socket 
//   --> req body, req.query, params
//   --> REST: methods, POST, GET, PUT, DELETE, not the same in web socket setup, 
//   --> we dont send back the response, we only emit the event to the desired client
