import express from "express";
import { 
  watch, 
  remove, 
  getEdit, 
  postEdit, 
  getUpload, 
  postUpload 
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter
.route("/upload")
.all(protectorMiddleware)
.get(getUpload)
.post(videoUpload.fields([
  {name: "video"},
  {name: "thumb"},
]), 
postUpload,
);

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/remove").all(protectorMiddleware).get(remove);

export default videoRouter;