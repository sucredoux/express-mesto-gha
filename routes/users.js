const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUserById);
userRoutes.post("/", express.json(), createUser);
userRoutes.patch("/me", express.json(), updateUser);
userRoutes.patch("/me/avatar", express.json(), updateAvatar);

module.exports = userRoutes;
