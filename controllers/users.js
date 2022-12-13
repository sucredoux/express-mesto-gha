/* eslint-disable no-console */
const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  OK,
  CREATED,
} = require('../constants/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(OK).send(users.map((user) => ({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      })));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
        );
      }
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(OK).send({
          user,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Невалидный id' });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: 'Ошибка сервера' });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
        );
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res
      .status(CREATED)
      .send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      }))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
        );
      }
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(OK).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
        );
      }
    });
};

const updateAvatar = (req, res) => {
  User.findOneAndUpdate(
    req.user.id,
    {
      avatar:
        req.body.avatar,
    },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(OK).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
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
