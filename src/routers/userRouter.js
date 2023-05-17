import express from "express";
import { remove, edit, getProfile, logout, postProfile } from "../controllers/userController";
import { protectorMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware ,logout);
userRouter.route("/profile").all(protectorMiddleware).get(getProfile).post(postProfile);
userRouter.get("/:id(\\d+)/remove", remove);

export default userRouter;