import { Request } from "express";

export interface IUserReq extends Request {
  user?: { _id?: string };
}
