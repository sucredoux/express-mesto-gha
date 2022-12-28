const express = require('express');
const {
  getUsers,
  getUserById,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const { validateUserInfo } = require('../middlewares/validation');

const userRoutes = express.Router();

userRoutes.get('/', getUsers);
userRoutes.get('/me', validateUserInfo, getUser);
userRoutes.patch('/me', validateUserInfo, updateUser);
userRoutes.patch('/me/avatar', validateUserInfo, updateAvatar);
userRoutes.get('/:id', getUserById);

module.exports = userRoutes;
