import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { addComment, updateComment, deleteComment, getVideoComments } from "../controllers/comment.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/c/:videoId").get(getVideoComments);
router.route("/c/:videoId/add-comment").post(addComment);
router.route("/c/:commentId/v/:videoId/update-comment").patch(updateComment);
router.route("/c/:commentId/v/:videoId/delete-comment").delete(deleteComment);

export default router;