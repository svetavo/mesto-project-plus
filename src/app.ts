require("dotenv").config();

import express from "express";
import { errors } from "celebrate";
import mongoose from "mongoose";
import router from "./routes/index";
import { login, createUser } from "./controllers/users";
import { requestLogger, errorLogger } from "./middleware/logger";
import errorHandler from "./middleware/errors";
import { userLoginValidator, userRegValidator } from "./middleware/validation";
import CustomError from "./errors/custom-error";

const { PORT = 3000 } = process.env;
const { SERVER_DB, DB_MONGO } = process.env;

const app = express();

mongoose.connect(`mongodb://${SERVER_DB}/${DB_MONGO}`);
console.log("MongoDB connected!");

app.use(express.json());

app.use(requestLogger);
app.post("/signin", userLoginValidator, login);
app.post("/signup", userRegValidator, createUser);

app.use(router);

app.get("*", (req, res, next) => {
  return next(CustomError.notFound("Такой страницы не существует"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
