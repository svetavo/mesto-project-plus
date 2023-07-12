import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/custom-error";

// eslint-disable-next-line no-unused-vars
const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line no-param-reassign
  error.statusCode = error.statusCode || 500;
  // eslint-disable-next-line no-param-reassign
  error.message = error.message || "Ошибка на сервере";
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};

export default errorHandler;
