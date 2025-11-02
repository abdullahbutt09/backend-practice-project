import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import { PORT } from "./config/index.js";


dotenv.config({
    path: "./.env"
});

connectDB()
.then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });
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