import { Router } from "express";
import {
  infoUpdateValidator,
  avatarUpdateValidator,
  userIdValidator,
} from "../middleware/validation";
import {
  getUsers,
  getUserId,
  avatarUpdate,
  userUpdate,
  getCurrentUser,
} from "../controllers/users";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/me", getCurrentUser);
userRouter.get("/:id", userIdValidator, getUserId);
userRouter.patch("/me", infoUpdateValidator, userUpdate);
userRouter.patch("/me/avatar", avatarUpdateValidator, avatarUpdate);

export default userRouter;
