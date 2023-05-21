import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Comment";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = process.env.PORT || 4000;

//Port Listen
app.listen(PORT, () => console.log(`Server Listening on Port http://localhost:${PORT} 🔥`));