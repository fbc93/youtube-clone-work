import express from "express";
import { remove, getProfile, logout, postProfile, getChangePassword, postChangePassword, userInfo } from "../controllers/userController";
import { avatarUpload, protectorMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware ,logout);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);

userRouter
.route("/profile")
.all(protectorMiddleware)
.get(getProfile)
.post(avatarUpload.single("avatar"), postProfile);

userRouter.get("/:id(\\d+)/remove", remove);
userRouter.get("/:id([0-9a-f]{24})", userInfo);

export default userRouter;