import { Router } from "express";
import { 
    changeCurrentUserPassword, 
    getCurrentUser, 
    getUserChannelProfile, 
    getUserWatchHistory, 
    loginUser, 
    logOutUser, 
    refreshAccessToken, 
    registerUser, 
    upateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage 
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },

        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);

//secure routes

router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, upateAccountDetails);
router.route("/change-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/change-cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getUserWatchHistory);

export default router;