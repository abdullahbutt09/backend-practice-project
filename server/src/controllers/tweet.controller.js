import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandlerPromise.js";

const createTweet = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user?._id);

    if (!user) 
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    const { content } = req.body;

    if (!content || !content.trim()) {
        throw new apiError(400, "Tweet content is required!");
    }

    // Create tweet using logged-in user's ID
    const createdTweet = await Tweet.create({
        owner: user._id,
        content: content.trim(),
    });

    // Populate owner details before sending response (optional)
    const populatedTweet = await Tweet.findById(createdTweet._id)
        .populate("owner", "username fullName avatar")
        .select("-__v");

    return res
    .status(201)
    .json(
        new apiResponse(
            201,
            populatedTweet,
            "Tweet created successfully!"
        )
    );
});

const getUserTweets = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user?._id);

    if (!user) 
    {
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

    const { updatedTweetContent } = req.body;
    const { tweetId } = req.params;

    if (!updatedTweetContent || !updatedTweetContent.trim()) 
    {
        throw new apiError(400, "Tweet content is empty!");
    }

    const user = await User.findById(req.user?._id);

    if (!user) 
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    const tweetToUpdated = await Tweet.findOneAndUpdate(

        {
            _id: tweetId,
            owner: user._id
        },

        {
            $set:
            {
                content: updatedTweetContent
            }
        },

        {
            new: true
        }
    );    

    if(!tweetToUpdated)
    {
        throw new apiError(404, "Tweet not updated or you are not the owner!");
    }

    return res
    .status(200)
    .json(new apiResponse(
        200,
        tweetToUpdated,
        "Tweet Updated Successfully!"
    ))
})

const deleteTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params;
    const user = await User.findById(req.user?._id);

    if (!user) 
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    const deletedTweet = await Tweet.findOneAndDelete({
        _id: tweetId,
        owner: user._id
    });

    if(!deletedTweet) 
    {
        throw new apiError(404, "Tweet not found or you are not the owner!");
    }

    return res
    .status(200)
    .json(new apiResponse(
        200,
        deletedTweet,
        `Tweet successfully deleted!`
    ))
})

const deleteBulk = asyncHandler(async (req, res) => {

    const { tweetsIds } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) 
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    const BulkDeletedTweets = await Tweet.deleteMany({
        
        _id:
        {
            $in: tweetsIds
        },

        owner: user._id
    });

    if(!BulkDeletedTweets) 
    {
        throw new apiError(404, "Tweets not found or you are not the owner!");
    }

    return res
    .status(200)
    .json(new apiResponse(
        200,
        BulkDeletedTweets,
        "Your selected tweets successfully deleted!"
    ))
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    deleteBulk
}

// delete many --> document ke id do then wo saray documents us id ke delete kardenga but Does not return the deleted documents!

// delete one --> document ke id do then wo document delete kardonga but Does not return the deleted document!

// findByIdAndDelete --> document ke id do then wo document delete kardonga also Returns the deleted document very useful if you want to send it back in response

// findOneAndDelete --> Deletes first document matching filter Returns the deleted document Useful when your filter is not just _id