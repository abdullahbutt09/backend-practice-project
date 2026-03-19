import mongoose, { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandlerPromise.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Video } from "../models/video.models.js";
import { subscription } from "../models/subscription.models.js"
import { Like } from "../models/like.models.js";

const getChannelStats = asyncHandler(async (req, res) => {

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

    const totalSubscribers = await subscription.countDocuments({
        channel: userId
    })

    const count_Views_Videos = await Video.aggregate([
        {
            $match: 
            {
                owner: userId
            }
        },
        
        {
            $group: 
            {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" }
            }
        },
    ])

    const stats = count_Views_Videos[0] || { totalVideos: 0, totalViews: 0 };

    const totalLikes = await Like.aggregate([
        {
            $lookup: 
            {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },

        {
            $addFields: 
            {
                videoDetails: { $first: "$videoDetails" }
            }
        },

        {
            $match: 
            {
                "videoDetails.owner": userId
            }
        },

        {
            $group: 
            {
                _id: null,
                totalLikes: { $sum: 1 }
            }
        }
    ])

    const likesData = totalLikes[0] || { totalLikes: 0 };

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            {
                totalSubscribers,
                stats,
                likesData
            },
            "stats fetched of channel successfully!"
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    if (!userId) {
        throw new apiError(401, "User not logged in!");
    }

    if (!isValidObjectId(userId)) {
        throw new apiError(400, "Invalid user id!");
    }

    const videos = await Video.find({ owner: userId })
        .sort({ createdAt: -1 })
        .select("title thumbnail views createdAt");

    if (!videos.length) 
    {
        throw new apiError(404, "No videos found for this channel!");
    }

    return res.status(200).json(
        new apiResponse(
            200,
            videos,
            "Channel videos fetched successfully!"
        )
    );
});

export {
    getChannelStats, 
    getChannelVideos
}