const express = require('express');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const authRoutes = require('./auth');
const auth = require('../middlewares/auth');
const { NotFoundErr } = require('../errors');

const routes = express.Router();

routes.use('/', authRoutes);
routes.use('/users', auth, userRoutes);
routes.use('/cards', auth, cardRoutes);

routes.use('/', express.json(), auth, (req, res, next) => {
  try {
    throw new NotFoundErr('Страница не найдена');
  } catch (err) {
    next(err);
  }
});

module.exports = routes;
