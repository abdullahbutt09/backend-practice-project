import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { User } from "../models/user.models.js";
import { Tweet } from "../models/tweet.models.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandlerPromise.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    const { videoId } = req.params;

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

    // Validate commentId
    if (!videoId || !isValidObjectId(videoId)) 
    {
        throw new apiError(400, "Invalid video id!");
    }

    const existingVideoLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    });

    if (existingVideoLike) {
        await Like.deleteOne({ _id: existingVideoLike._id });

        return res.status(200).json(
            new apiResponse(200, { Like: false }, "Video Like Removed successfully")
        );
    }

    await Like.create({
        video: videoId,
        likedBy: userId
    });

    return res.status(200).json(
        new apiResponse(200, { Like: true }, "Video Like Done successfully")
    );
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    const { commentId } = req.params;

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

    // Validate commentId
    if (!commentId || !isValidObjectId(commentId)) 
    {
        throw new apiError(400, "Invalid comment id!");
    }

    const existingCommentLike = await Like.findOne({
        comment: commentId,
        likedBy: userId
    });

    if (existingCommentLike) {
        await Like.deleteOne({ _id: existingCommentLike._id });

        return res.status(200).json(
            new apiResponse(200, { Like: false }, "Comment Like Removed successfully")
        );
    }

    await Like.create({
        comment: commentId,
        likedBy: userId
    });

    return res.status(200).json(
        new apiResponse(200, { Like: true }, "Comment Like Done successfully")
    );
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    const { tweetId } = req.params;

    const userId = req.user._id;

   // Auth check
    if (!userId) 
    {
        throw new apiError(401, "User not logged in!");
    }

    // Validate userId
    if (!isValidObjectId(userId)) 
    {
        throw new apiError(400, "Invalid user id!");
    }

    // Validate tweetId
    if (!tweetId || !isValidObjectId(tweetId)) 
    {
        throw new apiError(400, "Invalid tweet id!");
    }

    const existingTweetLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    });

    if (existingTweetLike) {
        await Like.deleteOne({ _id: existingTweetLike._id });

        return res.status(200).json(
            new apiResponse(200, { Like: false }, "Tweet Like Removed successfully")
        );
    }

    await Like.create({
        tweet: tweetId,
        likedBy: userId
    });

    return res.status(200).json(
        new apiResponse(200, { Like: true }, "Tweet Like Done successfully")
    );
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id;

    // Auth check
    if (!userId) 
    {
        throw new apiError(401, "User not logged in!");
    }

    // Validate userId
    if (!isValidObjectId(userId)) 
    {
        throw new apiError(400, "Invalid user id!");
    }

    const likedVideos = await Like.find({ 
        likedBy: userId, 
        video: { $exists: true, $ne: null } 
    }).populate("video"); // populate video details

    const videos = likedVideos.map(like => like.video);

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            videos,
            "Liked videos fetched successfully"
        )
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}