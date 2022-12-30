const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateAuthBody = celebrate({
  body: {
    password: Joi.string().required()
      .messages({
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
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).messages({
      'any.messages': 'Невалидный id',
    }),
  }),
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
  }),
});

const validateCardInfo = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).messages({
      'any.messages': 'Невалидный id',
    }),
  }),
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
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).messages({
      'any.messages': 'Невалидный id',
    }),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).messages({
      'any.messages': 'Невалидный id',
    }),
  }),
});

module.exports = {
  validateAuthBody,
  validateUserInfo,
  validateCardInfo,
  validateUserId,
  validateCardId,
};
