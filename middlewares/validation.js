const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateAuthBody = celebrate({
  body: {
    password: Joi.string().min(8).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля 8 символов',
        'string.max': 'Максимальная длина поля 30 символов',
        'any.required': 'Обязательное поле',
      }),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Невалидный email');
    }).messages({
      'any.required': 'Обязательное поле',
    }),
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля 2 символа',
        'string.max': 'Максимальная длина поля 30 символов',
      }),
    about: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля 2 символа',
        'string.max': 'Максимальная длина поля 30 символов',
      }),
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
  },
});

const validateUserInfo = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).messages({
      'any.messages': 'Невалидный id',
    }),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля 2 символа',
        'string.max': 'Максимальная длина поля 30 символов',
      }),
    about: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля 2 символа',
        'string.max': 'Максимальная длина поля 30 символов',
      }),
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
  }).unknown(true),
});

const validateCardInfo = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).messages({
      'any.messages': 'Невалидный id',
    }),
  }).unknown(true),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля 2 символа',
        'string.max': 'Максимальная длина поля 30 символов',
        'any.required': 'Обязательное поле',
      }),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }).messages({
      'any.required': 'Обязательное поле',
    }),
  }).unknown(true),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).messages({
      'any.messages': 'Невалидный id',
    }),
  }).unknown(true),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).messages({
      'any.messages': 'Невалидный id',
    }),
  }).unknown(true),
});

module.exports = {
  validateAuthBody,
  validateUserInfo,
  validateCardInfo,
  validateUserId,
  validateCardId,
};
