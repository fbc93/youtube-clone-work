import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

//뷰 엔진
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

//미들웨어1_로그관리 
app.use(logger);

//미들웨어2_Form Value
app.use(express.urlencoded({ extended:true }));

//미들웨어3_Session
app.use(
  session({
    secret: "cloneTube",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/clonetube",
    }),
  })
);

//로그인 회원 확인 미들웨어
app.use(localsMiddleware);

//Routers
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;