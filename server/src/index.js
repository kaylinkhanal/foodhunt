// import express from 'express';
// import { createHandler } from 'graphql-http/lib/use/express';
// import connect from "./db/connect.js";
// import {
//   GraphQLObjectType,
//   GraphQLNonNull,
//   GraphQLInt,
//   GraphQLString,
//   GraphQLList,
//   GraphQLFloat,
//   GraphQLSchema,
//   GraphQLID
// } from 'graphql';
//  import User from './models/user.js';
// connect()
// const UserObject = new GraphQLObjectType({
//   name: 'User',
//   fields: () => ({
//     id: { type: new GraphQLNonNull(GraphQLID) },
//     name: { type: GraphQLString },
//     email: { type: GraphQLString },
//     phoneNumber: { type: GraphQLString },
//     address: { type: GraphQLString },
//     createdAt: { type: GraphQLString },
//   }),
// })


// // Construct a schema, using GraphQL schema language
// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'Query',
//     fields: {
//       getAllUsers: {
//         type: new GraphQLList(UserObject),
//         resolve: () => {
//          return User.find()
//         }
//       },
//       getUserById: {
//         type: UserObject,
//         args: {
//           id: { type: GraphQLID },
//         },
//         resolve: (_, args) => {
//          return User.findById(args.id)
//         }
//       },
//     },
//   }),
//   mutation: new GraphQLObjectType({
//     name: 'Mutation',
//     fields: {
//       deleteUserById: {
//         type: UserObject,
//         args: {
//           id: { type: GraphQLID },
//         },
//         resolve: (_, args) => {
//          return User.findByIdAndDelete(args.id)
//         }
//       },
//     },
//   }),
// })
 


// const app = express();
// app.all(
//   '/graphql',
//   createHandler({
//     schema: schema,
//   }),
// );

// import { ruruHTML } from 'ruru/server';
// app.get('/', (_req, res) => {
//   res.type('html');
//   res.end(ruruHTML({ endpoint: '/graphql' }));
// });

 
// app.listen(4000);
// console.log('Running a GraphQL API server at localhost:4000/graphql');



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

  // socket.on('user-active', (_id) => {
  //   activeUserMap[socket.id] = _id
  //   console.log(activeUserMap, "@@");
  // });

  // socket.on('user-logout', () => {
  //   onlineUser = onlineUser.filter((user) => user !== socket.id);
  //   console.log(onlineUser);
  // });
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




// java -----> 


// solutions architect