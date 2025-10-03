import mongoose from "mongoose";
import { db_name } from "../constants.js";

const connectDB = async () => {
    try {
        const connecitonInstance = await mongoose.connect(`${process.env.MONGO_URI}/${db_name}`);
        console.log(`\n MongoDB connected: ${connecitonInstance.connection.host}\n`);
        console.log(`\n MongoDB connected: ${connecitonInstance}\n`);

    } catch (error) {
        console.log("Error in DB connection", error);
        process.exit(1);
    }
}

export default connectDB;