import mongoose, {isValidObjectId} from "mongoose"
import { Video } from "../models/video.models.js"
import { User } from "../models/user.models.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandlerPromise.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    //check for user validation

    const user = await User.findById(req.user._id);

    if(!user)
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    //need to add a check for good title words not cussed words!

    const videoLocalPath = req.files?.video[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
        throw new apiError(400, "Video local file path is required");
    }

    const videoUpload = await uploadOnCloudinary(videoLocalPath);
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if(!videoUpload)
    {
        throw new apiError(400, "Video upload failed on cloudinary!");
    }

    const video = await Video.create({
        videoFile: 
        {
            url: videoUpload?.secure_url,
            publicId: videoUpload?.public_id
        },
        thumbnail: thumbnailUpload
            ? {
                url: thumbnailUpload?.secure_url,
                publicId: thumbnailUpload?.public_id
            }
            : undefined,
        owner: user._id,
        title: title || new Date().toLocaleDateString('en-GB'),
        description: description || "",
        duration: Math.floor(videoUpload.duration)
    });

    return res
    .status(200)
    .json(new apiResponse(
        200,
        video,
        "Video Uploaded Successfully"
    ))
});

const getVideoById = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    const user = await User.findById(req.user._id);

    if(!user)
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    const video = await Video.findByIdAndUpdate(

        {
            _id: videoId,
            owner: user?._id
        },
        
        { 
            $inc: 
            { 
                views: 1 
            } 
        },

        { 
            new: true 
        }
    );

    if (!video) 
    {
        throw new apiError(404, "Video not found");
    }

    return res.status(200).json(
        new apiResponse(
        200, 
        video, 
        "Video fetched successfully"
    ));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}