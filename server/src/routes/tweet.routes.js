import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet } from "../controllers/tweet.controller.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create-tweet").post(createTweet);

export default router;