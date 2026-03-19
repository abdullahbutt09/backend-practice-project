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

    const playlists = await Playlist.find({
        owner: userId
    });

    if (!playlists.length) 
    {
        throw new apiError(404, "No playlists found!");
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            playlists,
            "User playlists fetched successfully"
        )
    )
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

    const playlist = await Playlist.findOne({
        _id: playlistId,
        owner: userId
    }).populate("videos", ""); // 🔥 important

    if (!playlist) {
        throw new apiError(404, "Playlist not found or not authorized!");
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200, 
            playlist, 
            "Playlist fetched successfully"
        )
    );
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;

    const userId = req.user._id;

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

    const video = await Video.findById(videoId);

    if(!video)
    {
        throw new apiError(404, "Video not found or not exist!");
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: userId
        },

        {
            $addToSet:
            {
                videos: videoId
            }
        },

        {
            new: true
        }
    )

    if(!playlist)
    {
        throw new apiError(404, "playlist not updated or you are not the owner!");
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200, 
            playlist, 
            "Video added in playlist Successfully!"
        )
    );
})

//NOTE: Remember to make a bulk video remover from playlist also
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

    const video = await Video.findById(videoId);

    if(!video)
    {
        throw new apiError(404, "Video not found or not exist!");
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: userId
        },

        {
            $pull:
            {
                videos: videoId
            }
        },

        {
            new: true
        }
    );

    return res
    .status(200)
    .json(
        new apiResponse(
            200, 
            playlist, 
            "Video removed from playlist Successfully!"
        )
    );
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

    const deletedPlaylist = await Playlist.findOneAndDelete({
        _id: playlistId,
        owner: userId
    });

    if(!deletedPlaylist) 
    {
        throw new apiError(404, "Playlist not found or you are not the owner!");
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200, 
            deletedPlaylist, 
            "Playlist deleted successfully!"
        )
    );
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

    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: userId
        },
        
        { 
            $set: 
            {
                playlistName: name,
                playlistDescription: description
            } 
        },

        { 
            new: true 
        }
    );

    if (!updatedPlaylist) 
    {
        throw new apiError(404, "Playlist not updated or you are not the owner!");
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200, 
            updatedPlaylist, 
            "Playlist details updated successfully"
        )
    );
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