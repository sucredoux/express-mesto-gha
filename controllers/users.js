/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  OK,
  CREATED,
} = require('../constants/status');
const {
  BadRequestErr, MongoDuplicateErr, NotFoundErr, AuthErr,
} = require('../errors');

const { NODE_ENV, JWT_SECRET_KEY } = process.env;

const SALT_ROUNDS = 10;

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthErr('Неправильный email или пароль');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new AuthErr('Неправильный email или пароль');
    }

    const token = jwt.sign({ _id: user._id, email: user.email }, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev_secret', { expiresIn: '7d' });

    return res.status(OK).send({ message: 'Аутентификация пройдена', token });
  } catch (err) {
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      email, password: hash, name, about, avatar,
    });
    if (newUser) {
      return res.status(CREATED).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
        _id: newUser._id,
      });
    }
    return true;
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    }
    if (err.name === 'MongoServerError') {
      next(new MongoDuplicateErr(err.message));
    }
    return next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(OK).send(users);
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userById = await User.findById(req.params.id);
    if (!userById) {
      throw new NotFoundErr('Запрашиваемый пользователь не найден');
    } else {
      return res.status(OK).send({
        userById,
      });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Невалидный id'));
    }
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!req.user._id) {
      throw new NotFoundErr('Пользователь не найден');
    }
    return res.status(OK).send(user);
  } catch (err) {
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, about: req.body.about },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundErr('Пользователь не найден');
    }
    return res
      .status(OK)
      .send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    }
    return next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundErr('Пользователь не найден');
    } else {
      return res.status(OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    }
    return next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
