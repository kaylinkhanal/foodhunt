import mongoose from 'mongoose'
async function connect(){
   const res = await  mongoose.connect('mongodb://localhost:27017/foodHuntDB')
   if(res) console.log("Connected to MongoDB successfully");
}


export default connect;