import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/clonetube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

const handleError = (error) => console.log("DB Error", error);
const handleOpen = () => console.log("Connected DB ✅");

db.on("error", handleError);
db.once("open", handleOpen);