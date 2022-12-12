const express = require("express");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  OK,
  CREATED,
} = require("../constants/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === "Validation Error") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Ошибка сервера" });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `
        );
      }
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new Error("Запрашиваемый пользователь не найден");
      } else {
        res.status(OK).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === "Cast Error") {
        res.status(BAD_REQUEST).send({ message: "Невалидный id" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Ошибка сервера" });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `
        );
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) =>
      res.status(OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      })
    )
    .catch((err) => {
      if (err.name === "Validation Error") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Ошибка сервера" });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `
        );
      }
    });
};

const updateUser = (req, res) => {
  console.log(req.user);
  User.findByIdAndUpdate(
    req.user._id,
    { name: "Ivan", about: "tsarevich" },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "Пользователь не найден" });
      } else {
        res.status(OK).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === "Validation Error") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Ошибка сервера" });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `
        );
      }
    });
};

const updateAvatar = (req, res) => {
  User.findOneAndUpdate(
    req.user.id,
    {
      avatar:
        "https://images.unsplash.com/photo-1620924049153-4d32fcbe88fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bmV3fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=700&q=60",
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "Пользователь не найден" });
      } else {
        res.status(OK).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === "BAD_REQUEST") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Ошибка сервера" });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `
        );
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
