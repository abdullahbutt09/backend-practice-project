import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./.env"
});

connectDB();
/*

const app = express();

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${db_name}`);
        app.on("error" , (error) => {
            console.log("Error in DB connection", error);
            throw error;
        })

        app.listen(process.env.PORT , () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("Error in DB connection", error);
        throw error;
    }
})();

*/