import asyncHandler from "../utils/asyncHandlerPromise.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";
import apiResponse from "../utils/apiResponse.js";

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
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || "",
        email,
        password,
        username: username.toLowerCase()
    })

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
    const { username, email, password } = req.body;

    if(!username || !email)
    {
        throw new apiError(400, "username or email is required!");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user)
    {
        throw new apiError(404, "User don't exist!");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    
    if(!isPasswordValid)
    {
        throw new apiError(401, "Password is incorrect!")
    }

    const { accessToken, refreshToken } = await generate_access_refresh_tokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const optionsForCookies = {
        httpOnly: true,
        secure: true
    }

    return res.
    status(200).
    cookie("acessToken", accessToken, optionsForCookies).
    cookie("refreshToken", refreshToken, optionsForCookies).
    json(
        new apiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },

            "User Logged In Successfully!"
        )
    );

})

export { 
    registerUser,
    loginUser
};