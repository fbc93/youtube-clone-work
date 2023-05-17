import express from "express";
import { remove, getProfile, logout, postProfile, getChangePassword, postChangePassword } from "../controllers/userController";
import { protectorMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware ,logout);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.route("/profile").all(protectorMiddleware).get(getProfile).post(postProfile);
userRouter.get("/:id(\\d+)/remove", remove);

export default userRouter;