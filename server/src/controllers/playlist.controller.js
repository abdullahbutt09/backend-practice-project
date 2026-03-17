import mongoose, {isValidObjectId} from "mongoose"
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandlerPromise.js";
import { Playlist } from "../models/playlist.models.js";
import { Video } from "../models/video.models.js";

const createPlaylist = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    if (!userId) {
        throw new apiError(401, "User not logged in!");
    }

    if (!isValidObjectId(userId)) {
        throw new apiError(400, "Invalid user id!");
    }

    const { name, description, videoIds } = req.body;

    // Validate videoIds array
    if (!Array.isArray(videoIds) || videoIds.length === 0) {
        throw new apiError(400, "videoIds must be a non-empty array!");
    }

    // Check all ids are valid
    const isValid = videoIds.every(id => isValidObjectId(id));

    if (!isValid) 
    {
        throw new apiError(400, "Invalid video IDs!");
    }

    // Check videos exist
    const videos = await Video.find({ _id: { $in: videoIds } });

    const videosCount = await Video.countDocuments({ _id: { $in: videoIds } });

    if (videosCount !== videoIds.length) {
        throw new apiError(400, "Some videos not found or private!");
    }

    const playlist = await Playlist.create({
        owner: userId,
        playlistName: name || new Date().toLocaleDateString('en-GB'),
        playlistDescription: description || "",
        videos: videoIds
    });

    return res.status(201).json(
        new apiResponse(201, 
        {
            playlist,
            VideosInPlaylist: videos.length
        }, 
        "Playlist created successfully")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    const { userId } = req.params

    const user = req.user._id;

    if(!user)
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    if (!isValidObjectId(user)) 
    {
        throw new apiError(400, "Invalid user id!");
    }

    if(!userId)
    {
        throw new apiError(401, "Invalid userId for getting playlist details!");
    }

    // Validate userId
    if (!isValidObjectId(userId)) 
    {
        throw new apiError(400, "Not valid Object user id!");
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id
    const { playlistId } = req.params

    const userId = req.user._id;

    // Auth check
    if(!userId)
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    // Validate userId
    if (!isValidObjectId(userId)) 
    {
        throw new apiError(400, "Invalid user id!");
    }

    if(!playlistId)
    {
        throw new apiError(401, "There is no such type of Playlist Id exist!");
    }

    // Validate userId
    if (!isValidObjectId(playlistId)) 
    {
        throw new apiError(400, "Invalid playlist Id!");
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // TODO: remove video from playlist
    const { playlistId, videoId } = req.params

    const userId = req.user._id;

    // Auth check
    if(!userId)
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    // Validate userId
    if (!isValidObjectId(userId)) 
    {
        throw new apiError(400, "Invalid user id!");
    }

    if(!playlistId || !videoId)
    {
        throw new apiError(401, "Playlist or videoId not provided Invalid!");
    }

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) 
    {
        throw new apiError(400, "Invalid Object Id for Playlist and Video!");
    }
})

const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist
    const { playlistId } = req.params

    const userId = req.user._id;

    // Auth check
    if(!userId)
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    // Validate userId
    if (!isValidObjectId(userId)) 
    {
        throw new apiError(400, "Invalid user id!");
    }

    if(!playlistId)
    {
        throw new apiError(401, "There is no such type of Playlist Id exist!");
    }

    if (!isValidObjectId(playlistId)) 
    {
        throw new apiError(400, "Invalid playlist Id!");
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    //TODO: update playlist
    const { playlistId } = req.params
    const {name, description} = req.body

    const userId = req.user._id;

    // Auth check
    if(!userId)
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    // Validate userId
    if (!isValidObjectId(userId)) 
    {
        throw new apiError(400, "Invalid user id!");
    }

    if(!playlistId)
    {
        throw new apiError(401, "There is no such type of Playlist Id exist!");
    }

    if (!isValidObjectId(playlistId)) 
    {
        throw new apiError(400, "Invalid playlist Id!");
    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}