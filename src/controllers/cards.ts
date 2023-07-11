import { Response, Request, NextFunction } from "express";
import Card from "../models/card";
import { SUCCESS, CREATED } from "../utils/status-codes";
import { IUserReq } from "../utils/types";
import { CustomError } from "../errors/custom-error";

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

export const deleteCard = async (
  req: IUserReq,
  res: Response,
  next: NextFunction
) => {
  const owner = req.user!._id;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(CustomError.notFound("Карточка не найдена"));
      }
      if (card?.owner.toString() !== owner) {
        return next(
          CustomError.forbidden("У вас недостаточно прав для удаления карточки")
        );
      }
      Card.findByIdAndRemove(req.params.cardId).then(() =>
        res.status(SUCCESS).send({ message: "Карточка удалена" })
      );
    })
    .catch((error) => {
      next(error);
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
    );
    if (!card) {
      return next(CustomError.notFound("Карточка не найдена"));
    }
    return res.status(SUCCESS).send(card);
  } catch (error) {
    next(error);
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
    );
    if (!card) {
      CustomError.notFound("Карточка не найдена");
    }
    return res.status(SUCCESS).send(card);
  } catch (error) {
    next(error);
  }
};
