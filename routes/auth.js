const express = require('express');
const { celebrate, Joi, error } = require('celebrate');
const {
  login,
  createUser,
} = require('../controllers/users');


const authRoutes = express.Router();

authRoutes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().alphanum().required().min(8),
  })
}), login);
authRoutes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().alphanum().required().min(8),
  }),
  headers: Joi.object({
    authorization: Joi.string(),
  }).unknown(true),
}), createUser);

module.exports = authRoutes;
