import { Router } from "express";
import {
  getCards,
  createCard,
  getCard,
  putLike,
  deleteLike,
  deleteCard,
} from "../controllers/cards";

const cardsRouter = Router();

cardsRouter.get("/", getCards);
cardsRouter.post("/", createCard);
cardsRouter.get("/:cardId", getCard);
cardsRouter.delete("/:cardId", deleteCard);
cardsRouter.put("/:cardId/likes", putLike);
cardsRouter.delete("/:cardId/likes", deleteLike);

export default cardsRouter;
