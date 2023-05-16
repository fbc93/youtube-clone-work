import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");

//뷰 엔진
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

//로그관리 
app.use(logger);

//Form Value
app.use(express.urlencoded({ extended:true }));

//Routers
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;