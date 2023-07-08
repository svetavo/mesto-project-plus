import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "Ошибка на сервере";
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};
