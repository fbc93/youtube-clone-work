import express from "express";
import { edit, watch, upload, remove } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/remove", remove);
videoRouter.get("/:id(\\d+)", watch);

export default videoRouter;