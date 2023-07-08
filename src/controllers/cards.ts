import { Response, Request, NextFunction } from "express";
import Card from "../models/card";
import { SUCCESS, CREATED } from "../utils/status-codes";
import { IUserReq } from "../utils/types";

const CustomError = require("../ errors/custom-error");

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send({ data: cards });
  } catch (error) {
    next(error);
  }
};

export const createCard = async (
  req: IUserReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const newCard = await Card.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.user!._id,
    });
    return res.status(CREATED).send(newCard);
  } catch (error) {
    next(error);
  }
};

export const getCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const card = await Card.findById(req.params.cardId).orFail();
    return res.status(SUCCESS).send(card);
  } catch (error) {
    return next(new CustomError(404, "Карточка не найдена"));
  }
};
export const deleteCard = async (
  req: IUserReq,
  res: Response,
  next: NextFunction
) => {
  const owner = req.user!._id;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new CustomError(404, "Карточка не найдена"));
      }
      if (card?.owner.toString() === owner) {
        Card.findByIdAndDelete(req.params.cardId);
        return res.status(SUCCESS).send("Карточка удалена");
      }
      return next(
        new CustomError(403, "У вас недостаточно прав для удаления карточки")
      );
    })
    .catch((error) => {
      return next(error);
    });
};

export const putLike = async (
  req: IUserReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user!._id } },
      { new: true }
    ).orFail();
    return res.status(SUCCESS).send(card);
  } catch (error) {
    return next(new CustomError(404, "Карточка не найдена"));
  }
};

export const deleteLike = async (
  req: IUserReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user!._id } },
      { new: true }
    ).orFail();
    return res.status(SUCCESS).send(card);
  } catch (error) {
    return next(new CustomError(404, "Карточка не найдена"));
  }
};
