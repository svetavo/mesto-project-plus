import { Router, Request, Response } from "express";
import {
  getUsers,
  createUser,
  getUserId,
  avatarUpdate,
  userUpdate,
} from "../controllers/users";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.post("/", createUser);
userRouter.get("/:id", getUserId);
userRouter.patch("/me", userUpdate);
userRouter.patch("/me/avatar", avatarUpdate);

export default userRouter;
