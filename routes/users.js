const express = require('express');
const { getUsers, getUserById } = require('../controllers/users');

const userRoutes = express.Router();

userRoutes.use('/', getUsers);
userRoutes.use('/:id', getUserById);

module.exports = userRoutes;