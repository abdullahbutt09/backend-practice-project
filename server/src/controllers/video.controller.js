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
    ));
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

    const { updatedTitle, updateddescription } = req.body;

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
            $set: 
            {
                title: updatedTitle,
                description: updateddescription
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
        "Video details updated successfully"
    ));
})

const updateVideoThumbnail = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.user._id);

    if(!user)
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    const { videoId } = req.params;

    const thumbnailLocalPath = req.file?.path;

    if(!thumbnailLocalPath)
    {
        throw new apiError(400, "Error Avatar file is missing!");
    }

    const currentVideo = await Video.findById(videoId).select("thumbnail");
    
    if(!currentVideo)
    {
        throw new apiError(404, "User not found!");
    }

    const getOldThumbnailId = currentVideo?.thumbnail.publicId;

    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if(!thumbnailUpload?.secure_url)
    {
        throw new apiError(500, "Error in uploading new avatar on cloudinary!");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        currentVideo._id, 
        {
            thumbnail:
            {
                url: thumbnailUpload?.secure_url,
                publicId: thumbnailUpload?.public_id
            }
        },

        {
            new: true
        }

    ).select("-password -refreshToken");

    if (getOldThumbnailId) {
        await deleteFromCloudinary(getOldThumbnailId);
    }

    return res
    .status(200)
    .json(new apiResponse(
        200,
        updatedVideo,
        "Thumbnail Image updated successfully!"
    ));
})

const deleteVideo = asyncHandler(async (req, res) => {

    const { videoIds } = req.body;

    //TODO: delete video and its thumbnail

    const user = await User.findById(req.user._id);

    if(!user)
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    //delete thumbnail and video from cloudinary

    const videos = await Video.find({

        _id: 
        { 
            $in: videoIds 
        },

        owner: user._id

    });

    if (!videos.length) {
        throw new apiError(404, "Videos not found or not yours!");
    }

    // 2️⃣ Delete from Cloudinary.

    await Promise.all(
        videos.map(video => {
        const deletes = [];

        if (video.videoFile?.publicId)
            deletes.push(
            deleteFromCloudinary(video.videoFile?.publicId)
        );

        if (video.thumbnail?.publicId)
            deletes.push(
            deleteFromCloudinary(video.thumbnail?.publicId)
        );

            return Promise.all(deletes);
        })
    );

    // 3️⃣ Delete from DB
    const deletedVideos = await Video.deleteMany({
        _id: 
        { 
            $in: videoIds 
        },
        owner: user._id
    });

    if(!deletedVideos)
    {
        throw new apiError(404, "Videos not found or you are not the owner!");
    }
    
    return res
    .status(200)
    .json(new apiResponse(
        200,
        deletedVideos,
        "Your selected videos successfully deleted!"
    ));
})

const togglePublishStatus = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { isPublishedStatus } = req.body;

    const user = await User.findById(req.user._id);

    if(!user)
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    const videoStatusToUpdated = await Video.findOneAndUpdate(
    
        {
            _id: videoId,
            owner: user._id
        },

        {
            $set:
            {
                isPublished: isPublishedStatus,
            }
        },

        {
            new: true
        }
    ); 


    return res
    .status(200)
    .json(new apiResponse(
        200,
        videoStatusToUpdated,
        "Video status updated successfully!"
    ));
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    updateVideoThumbnail
}