import express from "express";
import { 
  watch, 
  remove, 
  getEdit, 
  postEdit, 
  getUpload, 
  postUpload 
} from "../controllers/videoController";
import { protectorMiddleware } from "../middlewares";

const videoRouter = express.Router();

videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(postUpload);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/remove").all(protectorMiddleware).get(remove);
videoRouter.route("/:id([0-9a-f]{24})").all(protectorMiddleware).get(watch);

export default videoRouter;