import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

const CustomError = require("../errors/custom-error");

require("dotenv").config();
const jwt = require("jsonwebtoken");

export interface IGetUserAuthInfoRequest extends Request {
  user?: string | JwtPayload;
}

export const authCheck = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new CustomError(401, "Необходима авторизация"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new CustomError(401, "Ошибка авторизации"));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
