import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    publishAVideo, 
    getVideoById, 
    updateVideo, 
    updateVideoThumbnail,
    togglePublishStatus,
    deleteVideo
 } from "../controllers/video.controller.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/upload-video").post(
    upload.fields([

        {
            name: "video",
            maxCount: 1
        },

        {
            name: "thumbnail",
            maxCount: 1
        }
        
    ]),
    publishAVideo
);

router.route("/v/:videoId")
.get(getVideoById)
.patch(updateVideo);

router.route("/v/:videoId/thumbnail").patch(upload.single("thumbnail"), updateVideoThumbnail);
router.route("/v/:videoId/publish").patch(togglePublishStatus); // updates isPublished
router.route("/delete-videos").delete(deleteVideo)

export default router;