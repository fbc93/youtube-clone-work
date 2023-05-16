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
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/remove").get(remove);
videoRouter.get("/:id([0-9a-f]{24})", watch);

export default videoRouter;