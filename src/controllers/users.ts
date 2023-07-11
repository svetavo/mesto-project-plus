import { SUCCESS, CREATED, CONFLICT } from "../utils/status-codes";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { IUserReq } from "../utils/types";
import { CustomError } from "../errors/custom-error";

require("dotenv").config();

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
        CustomError.conflict("Пользователь с таким email уже зарегистрирован")
      );
    }
    const newUser = await User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
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
    const current = await User.findById(req.user?._id);
    if (!current) {
      return next(CustomError.notFound("Пользователь не найден"));
    }
    return res.status(SUCCESS).send(current);
  } catch (error) {
    return next(error);
  }
};

export const getUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userFind = await User.findById(req.params.id);
    if (!userFind) {
      return next(CustomError.notFound("Пользователь не найден"));
    }
    return res.status(SUCCESS).send(userFind);
  } catch (error) {
    return next(error);
  }
};

export const userUpdate = async (
  req: IUserReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      {
        name: req.body.name,
        about: req.body.about,
      },
      { new: true }
    );
    if (!user) {
      return next(CustomError.notFound("Пользователь не найден"));
    }
    return res.status(SUCCESS).send(user);
  } catch (error) {
    return next(error);
  }
};

export const avatarUpdate = async (
  req: IUserReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      {
        avatar: req.body.avatar,
      },
      { new: true }
    );
    if (!user) {
      return next(CustomError.notFound("Пользователь не найден"));
    }
    return res.status(SUCCESS).send(user);
  } catch (error) {
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    return res.send({
      token: jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string),
    });
  } catch (error) {
    next(error);
  }
};
