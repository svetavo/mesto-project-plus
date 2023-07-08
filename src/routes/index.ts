import { Router } from "express";
import userRouter from "./users";
import cardsRouter from "./cards";
import { authCheck } from "../middleware/auth";

const router = Router();
router.use("/users", authCheck, userRouter);
router.use("/cards", authCheck, cardsRouter);

export default router;
