import express, { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import router from "./routes/index";
import { login, createUser } from "./controllers/users";
import { requestLogger, errorLogger } from "./middleware/logger";
import { errorHandler } from "./middleware/errors";

require("dotenv").config();

const { PORT = 3000 } = process.env;
const { SERVER_DB, DB_MONGO } = process.env;

const app = express();

mongoose.connect(`mongodb://${SERVER_DB}/${DB_MONGO}`);
console.log("MongoDB connected!");

app.use(express.json());

app.use(requestLogger);
app.post("/signin", login);
app.post("/signup", createUser);

app.use(router);
app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
