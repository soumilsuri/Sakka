import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import fs from 'fs';

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.files);
    // Steps:-
    // 1.Get user details from frontend. for file upload we use multer middleware and call it in routes
    // 2.Validation - not empty.
    // 3.Check if user exist.
    // 4.check for images. check for avatar.
    // 5.upload avatar on cloudinary.
    // 6.create user object - entry in db.
    // 7.remove password and refresh token.
    // 8.check for user creation.
    // 9.return res.

    // 1 file upload handeled in user.routes.js using multer
    const {username, email, fullName, password} = req.body;

    // 2 validation
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // 3 check if user exists
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    // 4 check for avatar and coverImage
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path; // this give error if cover image is not given
    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
        coverImageLocalPath = req.files.coverImageLocalPath[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    // Log file paths to ensure they are correct
    console.log("Avatar path: ", avatarLocalPath);
    console.log("Cover image path: ", coverImageLocalPath);

    // Check if the file exists before uploading
    if (!fs.existsSync(avatarLocalPath)) {
        throw new ApiError(400, "Avatar file not found at path");
    }

    // 5 upload avatar and coverimage on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed")
    }

    // 6 create user object - entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    // 7 and 8 remove pasword and referashToken, check for user creation in db
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // 9 return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
    
    
})

export {registerUser}