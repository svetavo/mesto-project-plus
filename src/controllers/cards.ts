import { Response, Request } from "express";
import Card from "../models/card";
import mongoose from "mongoose";
import {
  INVALID_DATA,
  NOT_FOUND,
  INTERNAL_ERROR,
  SUCCESS,
  CREATED,
} from "../utils/status-codes";

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send({ data: cards });
  } catch (error) {
    return res.status(INTERNAL_ERROR).send("Ошибка сервера");
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const newCard = await Card.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.body.user._id,
    });
    return res.status(CREATED).send(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(INVALID_DATA)
        .send({ message: "Переданы невалидные данные" });
    }
    return res
      .status(INTERNAL_ERROR)
      .send({ message: "Произошла ошибка на стороне сервера" });
  }
};

export const getCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findById(req.params.cardId).orFail(
      new Error("NotFound")
    );
    return res.status(SUCCESS).send(card);
  } catch (error) {
    if (error instanceof Error && error.message === "NotFound") {
      return res
        .status(NOT_FOUND)
        .send("Карточка по указанному _id не найдена");
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(INVALID_DATA).send("Передан не валидный id");
    }
    return res.status(INTERNAL_ERROR).send("Ошибка сервера");
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId).orFail(
      new Error("NotFound")
    );
    return res.status(SUCCESS).send(card);
  } catch (error) {
    if (error instanceof Error && error.message === "NotFound") {
      return res
        .status(NOT_FOUND)
        .send("Карточка по указанному _id не найдена");
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(INVALID_DATA).send("Передан не валидный id");
    }
    return res.status(INTERNAL_ERROR).send("Ошибка сервера");
  }
};

export const putLike = async (req: Request, res: Response) => {
  try {
    console.log(req.body.user._id);
    console.log(req.params.cardId);
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.body.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    ).orFail(new Error("NotFound"));
    return res.status(SUCCESS).send(card);
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === "NotFound") {
      return res
        .status(NOT_FOUND)
        .send("Карточка по указанному _id не найдена");
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(INVALID_DATA).send("Передан не валидный id");
    }
    return res.status(INTERNAL_ERROR).send("Ошибка сервера");
  }
};

export const deleteLike = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.body.user._id } }, // убрать _id из массива
      { new: true }
    ).orFail(new Error("NotFound"));
    return res.status(SUCCESS).send(card);
  } catch (error) {
    if (error instanceof Error && error.message === "NotFound") {
      return res
        .status(NOT_FOUND)
        .send("Карточка по указанному _id не найдена");
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(INVALID_DATA).send("Передан не валидный id");
    }
    return res.status(INTERNAL_ERROR).send("Ошибка сервера");
  }
};

