const express = require('express');
const { errors } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const authRoutes = require('./auth');
const { NOT_FOUND } = require('../constants/errors');
const { auth } = require('../middlewares/auth');


const routes = express.Router();

routes.use('/', authRoutes);
routes.use('/users', auth, userRoutes);
routes.use('/cards', auth, cardRoutes);

routes.use(errors());
routes.use('/', express.json(), (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = routes;
