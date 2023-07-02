import express from "express";
import mongoose from "mongoose";
import router from "./routes/index";

const server = "127.0.0.1:27017";
const database = "mestodb";

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect(`mongodb://${server}/${database}`);
console.log("MongoDB connected!");

app.use(express.json());

app.use((req, res, next) => {
  req.body.user = {
    _id: "64999f4ad7b0fb293646f534",
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
