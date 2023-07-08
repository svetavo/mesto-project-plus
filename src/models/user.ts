import { NextFunction } from "express";
import mongoose from "mongoose";
import { urlValidation } from "../utils/constant";

const validator = require("validator");
const bcrypt = require("bcrypt");
const CustomError = require("../ errors/custom-error");

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      minlength: [2, "Минимальная длина 2 символа"],
      maxlength: [30, "Максимальная длина 30 символов"],
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: [2, "Минимальная длина 2 символа"],
      maxlength: [200, "Максимальная длина 200 символов"],
      default: "Исследователь",
    },
    avatar: {
      type: String,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validator: {
        validator: (v: string) => urlValidation.test(v),
        message: "Неверный формат ссылки",
      },
    },
    email: {
      type: String,
      required: true,
      validator: {
        validator: (v: string) => validator.isEmail(v),
        message: "Неверный формат email",
      },
      unique: true,
    },
    password: {
      type: String,
      require: true,
      default: "password",
      select: false,
    },
  },
  { versionKey: false }
);

userSchema.static(
  "findUserByCredentials",
  function findUserByCredentials(
    email: string,
    password: string,
    next: NextFunction
  ) {
    return this.findOne({ email })
      .select("+password")
      .then((user) => {
        if (!user) {
          return Promise.reject(
            next(new CustomError(401, "Неправильные почта или пароль"))
          );
        }

        return bcrypt.compare(password, user.password).then((matched: any) => {
          if (!matched) {
            return Promise.reject(
              next(new CustomError(401, "Неправильные почта или пароль"))
            );
          }

          return user;
        });
      });
  }
);

export default mongoose.model<IUser, UserModel>("User", userSchema);
