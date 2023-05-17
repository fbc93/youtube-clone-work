import express from "express";
import { remove, edit, getProfile, logout } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.route("/:id([0-9a-f]{24})/").get(getProfile);
userRouter.get("/:id(\\d+)/remove", remove);

export default userRouter;