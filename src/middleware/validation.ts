import { urlValidation } from "../utils/constant";
import { celebrate, Joi, Segments } from "celebrate";

export const cardValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(urlValidation).required(),
  }),
});

export const cardIdValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }),
});

export const userValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(urlValidation),
  }),
});

export const userLoginValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

export const userIdValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().alphanum().length(24).required(),
  }),
});

export const infoUpdateValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
});

export const avatarUpdateValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(urlValidation),
  }),
});