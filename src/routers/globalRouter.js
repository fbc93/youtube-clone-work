import express from "express";
import { getJoin, getLogin, postJoin, postLogin } from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { publicOnlyMiddlewawre } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/search", search);
globalRouter.route("/join").all(publicOnlyMiddlewawre).get(getJoin).post(postJoin);
globalRouter.route("/login").all(publicOnlyMiddlewawre).get(getLogin).post(postLogin);

export default globalRouter;
