import mongoose from "mongoose";
import { urlValidation } from "../utils/constant";
import { CustomError } from "../errors/custom-error";

const validator = require("validator");
const bcrypt = require("bcrypt");

interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
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
      select: false,
    },
  },
  { versionKey: false }
);

userSchema.static(
  "findUserByCredentials",
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select("+password")
      .then((user) => {
        if (!user) {
          return Promise.reject(
            CustomError.unathorized("Неправильные почта или пароль")
          );
        }

        return bcrypt.compare(password, user.password).then((matched: any) => {
          if (!matched) {
            return Promise.reject(
              CustomError.unathorized("Неправильные почта или пароль")
            );
          }

          return user;
        });
      });
  }
);

userSchema.set("toJSON", {
  transform(doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model<IUser, UserModel>("User", userSchema);
