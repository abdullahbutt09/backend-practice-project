import mongoose, {isValidObjectId} from "mongoose"
import { User } from "../models/user.models.js";
import { subscription } from "../models/subscription.models.js"
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandlerPromise.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const currentUserId = req.user?._id;

    // 1️⃣ auth check
    if (!currentUserId) {
        throw new apiError(401, "User not logged in!");
    }

    // 2️⃣ validate ObjectId
    if (!isValidObjectId(channelId)) {
        throw new apiError(400, "Invalid channel id!");
    }

    // 3️⃣ prevent self subscribe
    if (currentUserId.toString() === channelId.toString()) {
        throw new apiError(400, "You cannot subscribe yourself!");
    }

    // 4️⃣ ensure channel exists (User collection)
    const channelExists = await User.exists({ _id: channelId });
    if (!channelExists) {
        throw new apiError(404, "Channel not found!");
    }

    // 5️⃣ check relationship (core toggle)
    const existingSubscription = await subscription.findOne({
        subscriber: currentUserId,
        channel: channelId
    });

    // 6️⃣ toggle
    if (existingSubscription) {
        await subscription.deleteOne({ _id: existingSubscription._id });

        return res.status(200).json(
            new apiResponse(200, { subscribed: false }, "Unsubscribed successfully")
        );
    }

    await subscription.create({
        subscriber: currentUserId,
        channel: channelId
    });

    return res.status(200).json(
        new apiResponse(200, { subscribed: true }, "Subscribed successfully")
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    //select users with channel with that specific channel id
    const { channelId } = req.params;

    const currentUserId = req.user?._id;

    // auth check
    if (!currentUserId) 
    {
        throw new apiError(401, "User not logged in!");
    }

    // validate ObjectId
    if (!isValidObjectId(channelId)) 
    {
        throw new apiError(400, "Invalid channel id!");
    }

    // ensure channel exists (User collection)
    const channelExists = await User.exists({ _id: channelId });

    if (!channelExists) 
    {
        throw new apiError(404, "Channel not found!");
    }

    const subscriberCount = await subscription.countDocuments({
        channel: channelId
    })

    const subscribers = await subscription
    .find({ channel: channelId })
    .sort({ createdAt: -1 }) // most recent first
    .limit(20)               // optional: limit for frontend
    .populate("subscriber", "username fullName avatar"); // select only needed fields

    const subscriberUsers = subscribers.map(s => s.subscriber);


    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            {
                subscriberCount,
                subscribers: subscriberUsers
            },
            "Subscribers Fetched Successfully!"
        )
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {

    // select all those channels where userid is subscriberId and count it
    const { subscriberId } = req.params;

    const currentUserId = req.user?._id;

    // auth check
    if (!currentUserId) 
    {
        throw new apiError(401, "User not logged in!");
    }

    // validate ObjectId
    if (!isValidObjectId(subscriberId)) 
    {
        throw new apiError(400, "Invalid channel id!");
    }

    // ensure channel exists (User collection)
    const userExists = await User.exists({ _id: subscriberId });

    if (!userExists) 
    {
        throw new apiError(404, "User not found!");
    }

    const subscribedChannelsCount = await subscription.countDocuments({
        subscriber: subscriberId
    })

      // 5️⃣ Get list of channels subscribed
    const subscriptionsList = await subscription
    .find({ subscriber: subscriberId })
    .sort({ createdAt: -1 })  // most recent first
    .limit(20)                // optional
    .populate("channel", "username fullName avatar"); // select only needed fields

    const channels = subscriptionsList.map(s => s.channel);

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            {
                subscribedChannelsCount,
                channels
            },
            "Subscribed Channels Fetched Successfully!"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}