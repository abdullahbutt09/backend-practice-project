import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, updatePlaylist, deletePlaylist, removeVideoFromPlaylist, addVideoToPlaylist, getPlaylistById, getUserPlaylists } from '../controllers/playlist.controller.js';

const router = Router();

router.use(verifyJWT);

router.route("/create-playlist").post(createPlaylist);

router.route("/p/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

router.route("/users/:userId/playlists").get(getUserPlaylists);

router.route("/p/:playlistId/v/:videoId")
.put(addVideoToPlaylist)
.delete(removeVideoFromPlaylist);

export default router;