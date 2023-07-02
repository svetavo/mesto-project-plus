import mongoose from "mongoose";

interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String },
    password: { type: String },
    name: {
      type: String,
      minlength: [2, "Минимальная длина 2 символа"],
      maxlength: [30, "Максимальная длина 30 символов"],
      required: [true, "имя - это обязательное поле"],
    },
    about: {
      type: String,
      minlength: [2, "Минимальная длина 2 символа"],
      maxlength: [200, "Максимальная длина 200 символов"],
      required: [true, "о себе - это обязательное поле"],
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

export default mongoose.model<IUser>("User", userSchema);
