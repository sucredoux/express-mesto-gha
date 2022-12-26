const express = require('express');
const {
  getUsers,
  getUserById,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

const userRoutes = express.Router();

userRoutes.get('/', getUsers);
userRoutes.get('/:id', getUserById);
userRoutes.get('/me', auth, getUser);
userRoutes.patch('/me', updateUser);
userRoutes.patch('/me/avatar', updateAvatar);

module.exports = userRoutes;
