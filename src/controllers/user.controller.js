import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinaty} from '../utils/cloudnary.js'
import { ApiResponse } from "../utils/ApiResponse.js"
const registerUser = asyncHandler( async (req, res)=>{

    //get user details from fontendh
    //validartion 
    // check if ser is already exits
    // check for images , chekc for avtar
    // upload them to cloudinary
    // craete user object - crrate entry in db
    // remve password and refresh token field from response
    // return res

    const {fullname, email, username, password} = req.body
    console.log("email",email);
    console.log("Fullname",fullname);
    console.log("username",username);

    if( 
        [fullname, email, password].some((field) =>
            field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser=  User.findOne({ 
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email 0r usernmae already exists")
    }

    const avatarLocalPath =  req.files?.avatar[0]?.path
    const coverImageLocalPath= req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(800,"avatar file is required")   
    }

    const avatar = await uploadOnCloudinaty(avatarLocalPath)
    const coverImage= await uploadOnCloudinaty(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(800,"avatar file is required")   
    }

    const user= await User.create({
        fullname,
        avatar: avatar.url,
        covarImage:coverImage?.url ||"",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser=  await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registing user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registerrd successfully")
    )

}) 

export {registerUser}

