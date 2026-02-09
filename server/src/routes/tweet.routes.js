import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/get-tweets").get(getUserTweets);
router.route("/create-tweet").post(createTweet);
router.route("/update-tweet").post(updateTweet);

export default router;