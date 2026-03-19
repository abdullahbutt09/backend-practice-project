import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandlerPromise.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Video } from "../models/video.models.js";
import { subscription } from "../models/subscription.models.js"
import { Like } from "../models/like.models.js";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStats, 
    getChannelVideos
}