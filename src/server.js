import express from "express";
import morgan from "morgan";

const PORT = 4000;
const app = express();
const logger = morgan("dev");

//Middleware


//Controller
const handleHome = (req, res) => {
  return res.send("home");
}

const handleLogin = (req, res) => {
  return res.send("login");
}

//Route
app.use(logger);
app.get("/", handleHome);
app.get("/login", handleLogin);

//Port Listen
app.listen(PORT, () => console.log(`Server Listening on Port http://localhost:${PORT} 🔥`));