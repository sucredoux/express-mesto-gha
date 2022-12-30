const express = require('express');
const {
  login,
  createUser,
} = require('../controllers/users');
const { validateAuthBody } = require('../middlewares/validation');

const authRoutes = express.Router();

authRoutes.post('/signin', validateAuthBody, login);
authRoutes.post('/signup', validateAuthBody, createUser);

module.exports = authRoutes;
