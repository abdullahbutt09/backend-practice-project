import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandlerPromise.js";

const createTweet = asyncHandler(async (req, res) => {
    // 1️⃣ Ensure user is logged in
    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    // 2️⃣ Validate content safely
    const { content } = req.body;

    if (!content || !content.trim()) {
        throw new apiError(400, "Tweet content is required!");
    }

    // 3️⃣ Create tweet using logged-in user's ID
    const createdTweet = await Tweet.create({
        owner: user._id, // ✅ store ObjectId, not full user object
        content: content.trim(),
    });

    // 4️⃣ Populate owner details before sending response (optional)
    const populatedTweet = await Tweet.findById(createdTweet._id)
        .populate("owner", "username fullName")
        .select("-__v");

    // 5️⃣ Send response
    return res.status(201).json(
        new apiResponse(
            201,
            populatedTweet,
            "Tweet created successfully!"
        )
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    // find user ?

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    const tweets = await Tweet.find({ owner: user._id }).sort({ createdAt: -1}).lean();

    return res
    .status(200)
    .json(new apiResponse(
        200,
        tweets,
        "Tweets fetched successfully!"
    ))
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}