import { CustomError } from "errors/custom-error";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Ошибка на сервере";
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};
