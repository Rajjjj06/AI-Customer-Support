import mongoose from "mongoose"
import dotenv from "dotenv"
import {logger} from "./logger.js"

dotenv.config()

 const conenctDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        logger.info("Connected to MongoDB");
        console.log("Connected to MongoDB");
    } catch (error) {
        logger.error(error);
        console.log("error", error)
        
    }
}

export default conenctDB;

