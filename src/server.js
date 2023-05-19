import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");

//뷰 엔진
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

//미들웨어1_로그관리 
app.use(logger);

//미들웨어2_Form Value
app.use(express.urlencoded({ extended:true }));

//미들웨어3_String를 Json으로 변환
app.use(express.json());

//미들웨어4_Session
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

//미들웨어5_로그인 회원 확인
app.use(localsMiddleware);

//Routers
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;