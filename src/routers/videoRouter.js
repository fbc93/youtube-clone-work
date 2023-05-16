import express from "express";
import { watch, upload, remove, getEdit, postEdit } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id(\\d+)/remove", remove);
videoRouter.get("/:id(\\d+)", watch);

export default videoRouter;