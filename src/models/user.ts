import mongoose from "mongoose";

const validator = require("validator");
const bcrypt = require("bcrypt");

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
    },
    email: {
      type: String,
      required: true,
      validator: (v: string) => validator.isEmail(v),
      unique: true,
    },
    password: {
      type: String,
      require: true,
      default: "password",
    },
  },
  { versionKey: false }
);

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }

    return bcrypt.compare(password, user.password).then((matched: any) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return user;
    });
  });
});

export default mongoose.model<IUser, UserModel>('User', userSchema);
