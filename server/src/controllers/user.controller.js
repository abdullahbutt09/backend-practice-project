import asyncHandler from "../utils/asyncHandlerPromise.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";
import apiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import { refreshToken } from "../config/index.js";
import mongoose from "mongoose";

const generate_access_refresh_tokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken };

    } catch (error) {
        throw new apiError(500, "Something went wrong while generating access and refresh tokens!");
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // res.status(200).json({
    //     message: "ok"
    // })

    // get user details from frontend
    // validation - sab kuch empty to ni ha
    // check if user already exist: username, email
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return ? response : otherwise error response return

    const {username, email, fullName, password} = req.body;
    console.log("study this also request.body"  , req.body);
    
    
    // if(fullName === "")
    // {
    //     throw new apiError(400, "full name is required");
    // }
    
    if([fullName, username, password, email].some((field) => field?.trim() === ""))
    {
        throw new apiError(400, "all fields are compulsory and required!");
        // check for email validation @ using include in production there is separate file where we make validation methods 
    }

    const existedUser = await User.findOne({
        $or : [{ username }, { email }]
    })

    if(existedUser)
    {
        throw new apiError(409, "User with email or username already exist!");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    // let coverImageLocalPath;

    // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
    // {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }

    console.log("check this also please " , req.files);    

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar local file path is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar)
    {
        throw new apiError(400, "Avatar upload failed on cloudinary!");
    }

    const user = await User.create({
        fullName,
        avatar: {
            url: avatar.secure_url,
            publicId: avatar.public_id
        },
        coverImage: coverImage
            ? {
                url: coverImage.secure_url,
                publicId: coverImage.public_id
            }
            : undefined,
        email,
        password,
        username: username.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser)
    {
        throw new apiError(500, "something went wrong while registering the user!");
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User Registered Successfully!")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body; // extracting all data from req.body for more information isko console karke dekh lena!

    if(!username && !email) // if user dont provide us username or email then throw error!
    {
        throw new apiError(400, "username or email is required!");
    }

    const user = await User.findOne({
        $or: [{username}, {email}] // finding user via email or username if exist in db
    })

    if(!user) // if user dont exsit throw error response
    {
        throw new apiError(404, "User don't exist!");
    }

    //At this point the user exist now check his/her password

    const isPasswordValid = await user.isPasswordCorrect(password); // checking password valid or not!
    
    if(!isPasswordValid) // if password is not valid throw error incorrect password!
    {
        throw new apiError(401, "Password is incorrect!")
    }

    //At this point username or email && password is correct 

    const { accessToken, refreshToken } = await generate_access_refresh_tokens(user._id); 
    // generate access and refresh token via method if username email password is correct

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken"); // might be expensive database call operation which you will decide is it expensive or not!

    const optionsForCookies = {
        httpOnly: true,
        secure: true
    } // these options -> optionsForCookies

    // With the above cookies options the cookies are only modifiable on server side!

    return res
    .status(200)
    .cookie("accessToken", accessToken, optionsForCookies)
    .cookie("refreshToken", refreshToken, optionsForCookies)
    .json(
        new apiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },

            "User Logged In Successfully!"
        )
    ); // send a json {} response with access and refresh token with loggedIn user object and a message also user logged in successfully!    
})

const logOutUser = asyncHandler( async(req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },

        {
            new: true
        }
    )

    const optionsForCookies = {
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .clearCookie("refreshToken", optionsForCookies)
    .clearCookie("accessToken", optionsForCookies)
    .json(
        new apiResponse(
            200,
            {},
            "User Logged Out!"
        )
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const user_refresh_Token = req.cookies.refreshToken || req.body.refreshToken;

    if(!user_refresh_Token)
    {
        throw new apiError(401, "unauthorized request!");
    }

    // at this point we have the token lets verify it

    try {
        const decodedToken = jwt.verify(user_refresh_Token, refreshToken);
    
        const user = await User.findById(decodedToken?._id);
    
        if(!user)
        {
            throw new apiError(401, "Invalid Refresh Token!");
        }
    
        if(user_refresh_Token !== user?.refreshToken)
        {
            throw new apiError(401, "Refresh Token is expired or used!");
        }
    
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generate_access_refresh_tokens(user._id);
    
        const cookies_options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accessToken", newAccessToken, cookies_options)
        .cookie("refreshToken", newRefreshToken, cookies_options)
        .json(
            new apiResponse(
                200,
                {
                    newAccessToken, newRefreshToken
                },
                "Access Token Refreshed Successfully!"
            )
        );
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid Refresh Token!")
    }
})

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, NewPasssword } = req.body;

    const user = await User.findById(req.user?._id);

    const is_Password_Correct = await user.isPasswordCorrect(oldPassword);

    if(!is_Password_Correct)
    {
        throw new apiError(400, "PASSWORD IS INCORRECT OR INVALID OLD PASSWORD!");
    }

    user.password = NewPasssword;

    user.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json(new apiResponse(
        200,
        {},
        "Password changed successfully!"
    ))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new apiResponse(
        200,
        req?.user,
        "user fetched successfully!"
    ));
})

const upateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if(!fullName || !email)
    {
        throw new apiError(400, "Invalid fullname and Email!");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },

        {
            new: true
        }
    ).select("-password");

    return res
    .status(200)
    .json(new apiResponse(
        200,
        user,
        "Account details updated successfully!"
    ))
})

const updateUserAvatar = asyncHandler(async (req, res) =>{
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath)
    {
        throw new apiError(400, "Error Avatar file is missing!");
    }

    const currentUser = await User.findById(req.user?._id).select("avatar");

    if(!currentUser)
    {
        throw new apiError(404, "User not found!");
    }
    
    const getOldAvatarId = currentUser?.avatar.publicId;

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    
    if(!avatar?.secure_url)
    {
        throw new apiError(500, "Error in uploading new avatar on cloudinary!");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id, 
        {
            avatar:
            {
                url: avatar?.secure_url,
                publicId: avatar?.public_id
            }
        },

        {
            new: true
        }

    ).select("-password -refreshToken");

    if (getOldAvatarId) {
        await deleteFromCloudinary(getOldAvatarId);
    }

    return res
    .status(200)
    .json(new apiResponse(
        200,
        updatedUser,
        "Avatar Image updated successfully!"
    ))
})

const updateUserCoverImage = asyncHandler(async (req, res) =>{
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath)
    {
        throw new apiError(400, "Error coverImage file is missing!");
    }

    const currentUser = await User.findById(req.user?._id).select("coverImage");
    const oldCoverImage_PublicId = currentUser.coverImage?.publicId;

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    
    if(!coverImage?.secure_url)
    {
        throw new apiError(400, "Error in uploading coverImage on cloudinary!");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id, 
        {
            coverImage:
            {
                url: coverImage?.secure_url,
                publicId: coverImage?.public_id
            }
        },

        {
            new: true
        }
    ).select("-password -refreshToken");

    if (oldCoverImage_PublicId) {
        await deleteFromCloudinary(oldCoverImage_PublicId);
    }

    return res
    .status(200)
    .json(new apiResponse(
        200,
        updatedUser,
        "Cover Image updated successfully!"
    ))
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if(!username?.trim())
    {
        throw new apiError(400, "username is missing!");
    }

    const channel = await User.aggregate([
        {
            $match: 
            {
                username: username?.lowercase()
            }
        },

        {
            $lookup:
            {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },

        {
            $lookup:
            {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },

        {
            $addFields:
            {
                subscribersCount:
                {
                    $size: "$subscribers"
                },

                ChannelsSubscribed:
                {
                    $size: "$subscribedTo"
                },

                isSubscribed:
                {
                    $cond:
                    {
                        if:{$in: [req.user?._id, "subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },

        {
            $project:
            {
                fullName: 1,
                username: 1,
                email: 1,
                subscribersCount: 1,
                ChannelsSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                isSubscribed: 1,
                createdAt: 1
            }
        }
    ])

    console.log(channel);

    if(channel?.length === 0)
    {
        throw new apiError(404, "Channel not found or not exist!");
    }

    return res
    .status(200)
    .json(new apiResponse(
        200,
        channel[0],
        "Channel profile fetched successfully!"
    ))
})

const getUserWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match:
            {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },

        {
            $lookup:
            {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistoryVideos",
                pipeline:[
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline:[
                                {
                                    $project:
                                    {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },

                    //frontend me jo chahiye wo yaha project kar dena

                    {
                        $addFields:
                        {
                            owner:
                            {
                                // $arrayElemAt: ["$ownerDetails", 0] // we can also use this method to get first element of array
                                $first: "$ownerDetails"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(new apiResponse(
        200,
        user[0]?.watchHistoryVideos || [],
        "User watch history fetched successfully!"
    ))
})

export { 
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentUserPassword,
    getCurrentUser,
    upateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getUserWatchHistory
};