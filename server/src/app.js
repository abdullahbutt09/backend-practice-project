import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"));

app.use(cookieParser({
    //you can explore more options here https://www.npmjs.com/package/cookie-parser
}))

// routes import

import userRouter from './routes/user.routes.js';
import tweetRouter from "./routes/tweet.routes.js"
import videoRouter from "./routes/video.routes.js"
import healthCheckRouter from "./routes/healthcheck.routes.js"

// routes declaration

app.use("/api/v1/users", userRouter); 
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/videos", videoRouter);


app.use("/api/v1/healthcheck", healthCheckRouter);

export default app;