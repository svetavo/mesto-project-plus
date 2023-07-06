import express from "express";
import mongoose from "mongoose";
import router from "./routes/index";
import { authCheck } from "./middleware/auth";
import { login, createUser } from "./controllers/users";
require("dotenv").config();

const { PORT = 3000 } = process.env;
const { SERVER_DB, DB_MONGO } = process.env;

const app = express();

mongoose.connect(`mongodb://${SERVER_DB}/${DB_MONGO}`);
console.log("MongoDB connected!");

app.use(express.json());

app.use((req, res, next) => {
  req.body.user = {
    _id: "64999f4ad7b0fb293646f534",
  };
  next();
});

app.post("/signin", authCheck, login);
app.post("/signup", createUser);

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
