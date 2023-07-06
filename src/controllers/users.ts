import {
  INTERNAL_ERROR,
  INVALID_DATA,
  NOT_FOUND,
  SUCCESS,
  CREATED,
} from "../utils/status-codes";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import jwt from "jsonwebtoken";
require("dotenv").config();

const bcrypt = require("bcrypt");

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(SUCCESS).send({ data: users });
  } catch (error) {
    return res.status(INTERNAL_ERROR).send("Ошибка сервера");
  }
};

// export const createUser = async (req: Request, res: Response) => {
//   try {
//     if (!req.body.name || !req.body.about || !req.body.avatar) {
//       return res
//         .status(INVALID_DATA)
//         .send("Переданы некорректные данные при создании пользователя");
//     }
//     const hashpass = bcrypt
//     .genSalt(10)
//     .then((salt: number) => bcrypt.hash(req.body.password, salt))
//     console.log(hashpass)
//     const newUser = await User.create({
//       name: req.body.name,
//       about: req.body.about,
//       avatar: req.body.avatar,
//       email: req.body.email,
//       password: hashpass,
//     });
//     return res.status(CREATED).send(newUser);
//   } catch (error) {
//     return res.status(INTERNAL_ERROR).send("Ошибка сервера");
//   }
// };

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        res
          .status(INVALID_DATA)
          .send("Пользователь с такой почтой уже зарегистрирован");
        next();
      } else {
        return bcrypt
          .genSalt(10)
          .then((salt: any) => bcrypt.hash(req.body.password, salt))
          .then((hash: any) => {
            var user = new User({
              name: req.body.name,
              about: req.body.about,
              avatar: req.body.avatar,
              email: req.body.email,
              password: hash,
            });
            return user.save();
          })
          .then((user: any) => {
            res.json(user);
            next();
          });
      }
    })
    .catch((err) => res.status(INTERNAL_ERROR).send("Ошибка сервера"));
};

export const getUserId = async (req: Request, res: Response) => {
  try {
    const userFind = await User.findById(req.params.id).orFail(
      new Error("NotFound")
    );
    return res.status(SUCCESS).send(userFind);
  } catch (error) {
    if (error instanceof Error && error.message === "NotFound") {
      return res
        .status(NOT_FOUND)
        .send("Пользователь по указанному _id не найден");
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(INVALID_DATA).send("Передан не валидный id");
    }
    return res.status(INTERNAL_ERROR).send("Ошибка сервера");
  }
};

export const userUpdate = async (req: Request, res: Response) => {
  try {
    if (!req.body.name) {
      return res
        .status(INVALID_DATA)
        .send("Переданы некорректные данные при обновлении профиля");
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    }).orFail(new Error("NotFound"));
    return res.status(SUCCESS).send(user);
  } catch (error) {
    if (error instanceof Error && error.message === "NotFound") {
      return res
        .status(NOT_FOUND)
        .send("Пользователь по указанному _id не найден");
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(INVALID_DATA).send("Передан не валидный id");
    }
    return res.status(INTERNAL_ERROR).send("Ошибка сервера");
  }
};

export const avatarUpdate = async (req: Request, res: Response) => {
  try {
    if (!req.body.avatar) {
      return res
        .status(INVALID_DATA)
        .send("Переданы некорректные данные при обновлении аватара");
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      avatar: req.body.avatar,
    }).orFail(new Error("NotFound"));
    return res.status(SUCCESS).send(user);
  } catch (error) {
    if (error instanceof Error && error.message === "NotFound") {
      return res
        .status(NOT_FOUND)
        .send("Пользователь по указанному _id не найден");
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(INVALID_DATA).send("Передан не валидный id");
    }
    return res.status(INTERNAL_ERROR).send("Ошибка сервера");
  }
};

export interface IGetUserAuthInfoRequest extends Request {
  user: string; // or any other type
}

export const login = (req: Request, res: Response) => {
  console.log("hi");
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user: any) => {
      res.send({
        token: jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string)
      });
    })
    .catch((err: any) => {
      res.status(401).send({ message: err.message });
    });
};
