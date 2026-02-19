import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleCommentLike, getLikedVideos, toggleTweetLike, toggleVideoLike } from '../controllers/like.controller.js';

const router = Router();

router.use(verifyJWT);

export default router;