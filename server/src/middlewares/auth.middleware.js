import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandlerPromise.js";
import jwt from "jsonwebtoken";
import { accessToken } from "../config/index.js"
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token)
        {
            throw new apiError(401, "un-authorized request!!!");
        }
    
        const decodedToken = jwt.verify(token, accessToken);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user)
        {
            throw new apiError(401, "Invalid access Token!");
        }
    
        req.user = user;
        next();
        
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid Access Token!");
    }
})