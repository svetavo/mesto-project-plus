import { Router, Request, Response } from "express";
import {
  getUsers,
  getUserId,
  avatarUpdate,
  userUpdate,
} from "../controllers/users";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUserId);
userRouter.patch("/me", userUpdate);
userRouter.patch("/me/avatar", avatarUpdate);

export default userRouter;
