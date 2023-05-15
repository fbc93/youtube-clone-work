import express from "express";
import { remove, edit, profile, logout } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/:id(\\d+)", profile);
userRouter.get("/:id(\\d+)/remove", remove);

export default userRouter;