import { Router } from "express";
import {registerUser, 
        logoutUser, 
        loginUser,
        refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

//multer to handel file upload
router.route("/register").post(
    upload.fields([
        {
            name: "avatar", //this should be same in frontend
            maxCount: 1       
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router