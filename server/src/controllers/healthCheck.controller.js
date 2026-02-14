import mongoose from "mongoose";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

import asyncHandler from "../utils/asyncHandlerPromise.js";

const healthcheck = asyncHandler(async (_, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message

    const dbStatus = mongoose.connection.readyState === 1;

    if (!dbStatus) 
    {
        throw new apiError(500, "Database not connected");
    }

    return res
    .status(200)
    .json(new apiResponse(
        200,
        {},
        "Server is running successfully!"
    ))
})

export {
    healthcheck
}