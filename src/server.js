import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;
const app = express();
const logger = morgan("dev");

//뷰 엔진
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

//로그관리 
app.use(logger);

//Routers
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

//Port Listen
app.listen(PORT, () => console.log(`Server Listening on Port http://localhost:${PORT} 🔥`));