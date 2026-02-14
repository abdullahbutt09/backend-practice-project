import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
  deleteBulk,
} from "../controllers/tweet.controller.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create-tweet").post(createTweet);
router.route("/get-tweets").get(getUserTweets);
router.route("/t/:tweetId").patch(updateTweet);
router.route("/t/:tweetId").delete(deleteTweet);

//bulk deletion
router
  .route("/delete-bulk-tweets")
  .delete(deleteBulk);

export default router;
