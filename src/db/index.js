import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB= async()=>{

    try{
       const connectionInsatnce= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       console.log(`\n MongoDb connected !! DB host:${connectionInsatnce.connection.host}`)

    } catch(error) {
        console.log("mongoose connections error:",error)
        process.exit(1)
    }
}

export default connectDB