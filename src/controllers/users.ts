import { SUCCESS, CREATED } from "../utils/status-codes";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { IUserReq } from "../utils/types";

require("dotenv").config();

const CustomError = require("../ errors/custom-error");

const bcrypt = require("bcrypt");

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});
    return res.status(SUCCESS).send({ data: users });
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return next(
        new CustomError(409, "Пользователь с таким email уже зарегистрирован")
      );
    }
    const newUser = await User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: bcrypt.hash(req.body.password, 10),
    });
    return res.status(CREATED).send(newUser);
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (
  req: IUserReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const current = await User.findById(req.user?._id).orFail();
    return res.status(SUCCESS).send(current);
  } catch (error) {
    return next(new CustomError(404, "Пользователь не найден"));
  }
};

export const getUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userFind = await User.findById(req.params.id).orFail();
    return res.status(SUCCESS).send(userFind);
  } catch (error) {
    return next(new CustomError(404, "Пользователь не найден"));
  }
};

export const userUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.name) {
      return next(
        new CustomError(
          409,
          "Введены некорректные данные при обновлении информации о пользователе"
        )
      );
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    }).orFail();
    return res.status(SUCCESS).send(user);
  } catch (error) {
    return next(new CustomError(404, "Пользователь не найден"));
  }
};

export const avatarUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.avatar) {
      return next(
        new CustomError(
          409,
          "Переданы некорректные данные при обновлении аватара"
        )
      );
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      avatar: req.body.avatar,
    }).orFail(new Error("UserNotFound"));
    return res.status(SUCCESS).send(user);
  } catch (error) {
    return next(new CustomError(404, "Пользователь не найден"));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if(!email || !password) {
    return next(new CustomError(401, "Введите логин и пароль"));
  }
  try {
    const user = await User.findUserByCredentials(email, password);
    if (!user) return next(new CustomError(401, "Неверный логин или пароль"));
    return res.send({
      token: jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string),
    });
  } catch (error) {
    next(error);
  }
};
