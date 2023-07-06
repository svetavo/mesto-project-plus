import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
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
    return res.status(401).send({ message: "Необходима авторизация" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    console.log(token, process.env.JWT_SECRET);
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).send({ message: "Не совпали токены" });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
