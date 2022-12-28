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
  },
});

const validateUserInfo = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: {
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
    /* avatar: Joi.string()
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Невалидный email');
    }).messages({
      'any.required': 'Обязательное поле',
    }), */
  },

});

module.exports = {
  validateAuthBody,
  validateUserInfo,
};
