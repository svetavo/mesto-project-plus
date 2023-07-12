import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import CustomError from "../errors/custom-error";

const jwt = require("jsonwebtoken");

export interface IGetUserAuthInfoRequest extends Request {
  user?: string | JwtPayload;
}

export const authCheck = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(CustomError.unathorized("Необходима авторизация"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(CustomError.unathorized("Необходима авторизация"));
  }

  req.user = payload;

  return next();
};
