import mongoose from "mongoose";

import { DB_NAME } from "../utils.js";

 const dbconnect= async()=>{
    try{
         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
         console.log(`MongoDB connected successfully to host: ${mongoose.connection.host}`);
 
    }
    catch(error){
        console.log(`Connection Failed : error ${error}`)
        process.exit(1);
    }
 }

 export default dbconnect;