import { Router } from "express";
import {
  getCards,
  createCard,
  putLike,
  deleteLike,
  deleteCard,
} from "../controllers/cards";
import { cardValidator, cardIdValidator } from "../middleware/validation";

const cardsRouter = Router();

cardsRouter.get("/", getCards);
cardsRouter.post("/", cardValidator, createCard);
cardsRouter.delete("/:cardId", cardIdValidator, deleteCard);
cardsRouter.put("/:cardId/likes", cardIdValidator, putLike);
cardsRouter.delete("/:cardId/likes", cardIdValidator, deleteLike);

export default cardsRouter;
