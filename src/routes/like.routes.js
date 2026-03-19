import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleCommentLike, getLikedVideos, toggleTweetLike, toggleVideoLike } from '../controllers/like.controller.js';

const router = Router();

router.use(verifyJWT);

router.route("/l/:videoId").post(toggleVideoLike);
router.route("/c/:commentId").post(toggleCommentLike);
router.route("/t/:tweetId").post(toggleTweetLike);
router.route("/get-liked-videos").get(getLikedVideos);

export default router;