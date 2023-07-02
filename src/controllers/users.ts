import {
  INTERNAL_ERROR,
  INVALID_DATA,
  NOT_FOUND,
  SUCCESS,
  CREATED,
} from "../utils/status-codes";
import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(SUCCESS).send({ data: users });
  } catch (error) {
    return res.status(INTERNAL_ERROR).send("На сервере произошла ошибка");
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    if (!req.body.name || !req.body.about || !req.body.avatar) {
      return res
        .status(INVALID_DATA)
        .send("Переданы некорректные данные при создании пользователя");
    }
    const newUser = await User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    });
    return res.status(CREATED).send(newUser);
  } catch (error) {
    return res.status(INTERNAL_ERROR).send("На сервере произошла ошибка");
  }
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
    return res.status(INTERNAL_ERROR).send("На сервере произошла ошибка");
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
    return res.status(INTERNAL_ERROR).send("На сервере произошла ошибка");
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
    return res.status(INTERNAL_ERROR).send("На сервере произошла ошибка");
  }
};
