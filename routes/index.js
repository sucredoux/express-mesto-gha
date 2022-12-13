const express = require('express');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { NOT_FOUND } = require('../constants/errors');

const routes = express.Router();

routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);

routes.use('/', express.json(), (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = routes;
