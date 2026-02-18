import mongoose from "mongoose"
import { Comment } from "../models/comment.models.js"
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandlerPromise.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const user = req.user._id;

    if(!user)
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    const { content } = req.body;

    if (!content || !content.trim()) 
    {
        throw new apiError(400, "Comment content is required!");
    }

    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if(!video)
    {
        throw new apiError(404, "Video not available or don't exist!");
    }

    const createdComment = await Comment.create({
        content: content.trim(),
        owner: user._id,
        video: video._id,
    });

    return res
    .status(201)
    .json(
        new apiResponse(
            200,
            createdComment,
            "Comment added successfully!"
        )
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const { updatedCommentContent } = req.body;
    const { commentId } = req.params;
    const { videoId } = req.params;

    if (!updatedCommentContent || !updatedCommentContent.trim()) 
    {
        throw new apiError(400, "Comment content is empty!");
    }

    const user = await User.findById(req.user?._id);

    if (!user) 
    {
        throw new apiError(401, "User not logged in or does not exist!");
    }

    const commentToUpdated = await Comment.findOneAndUpdate(
    
        {
            _id: commentId,
            owner: user._id,
            video: videoId // NOTE: PATCH /videos/:videoId/comments/:commentId
        },

        {
            $set:
            {
                content: updatedCommentContent.trim()
            }
        },

        {
            new: true
        }
    );

    if(!commentToUpdated)
    {
        throw new apiError(404, "Comment not updated or you are not the owner!");
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            commentToUpdated,
            "Comment updated successfully!"
        )
    )
})

const deleteComment = asyncHandler(async (req, res) => {

    const { commentId, videoId } = req.params;

    if (
        !mongoose.Types.ObjectId.isValid(videoId) ||
        !mongoose.Types.ObjectId.isValid(commentId)
    ) {
        throw new apiError(400, "Invalid ID format!");
    }

    const userId = req.user._id; // no need to query User again

    const comment = await Comment.findOne({
        _id: commentId,
        video: videoId
    });

    if (!comment) 
    {
        throw new apiError(404, "Comment not found!");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "Video not found!");
    }

    // Permission check
    if (
        comment.owner.toString() !== userId.toString() &&
        video.owner.toString() !== userId.toString()
    ) {
        throw new apiError(403, "You are not allowed to delete this comment!");
    }

    await comment.deleteOne();

    return res.status(200).json(
        new apiResponse(
            200,
            {},
            "Comment deleted successfully!"
        )
    );
});

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}