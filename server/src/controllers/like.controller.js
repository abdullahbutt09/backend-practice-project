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
        throw new apiError(400, "Invalid comment id!");
    }
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

})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}