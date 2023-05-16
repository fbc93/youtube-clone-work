import express from "express";
import { 
  watch, 
  remove, 
  getEdit, 
  postEdit, 
  getUpload, 
  postUpload 
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id(\\d+)/remove", remove);
videoRouter.get("/:id(\\d+)", watch);

export default videoRouter;