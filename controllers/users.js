/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const generateToken = require('../utils/jwt');
const { auth } = require('../middlewares/auth');

const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  OK,
  CREATED,
  AUTH,
  DUPLICATE_USER,
  MONGO_DUPLICATE,
} = require('../constants/status');
const {
  BadRequestErr, MongoDuplicateErr, AuthErr, NotFoundErr,
} = require('../errors');

const { NODE_ENV, JWT_SECRET_KEY } = process.env;

const SALT_ROUNDS = 10;

/*
const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res
          .status(AUTH)
          .send({ message: 'Требуется регистрация' });
      } else if (err.name === 'CastError') {
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
}; */

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new AuthErr(AuthErr.message);
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthErr(AuthErr.message);
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new AuthErr(AuthErr.message);
    }

    const token = jwt.sign({ _id: user._id, email: user.email }, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev_secret', { expiresIn: '7d' });

    /* const token = generateToken({ _id: user._id, email: user.email }); */


    res.cookie('token', token, {
      maxAge: 3600000 * 24 * 7,
      sameSite: true,
      httpOnly: true,
    }).status(OK).send({ message: 'Аутентификация пройдена', token });


    /*return res.status(200).send({ message: 'Аутентификация пройдена', token });*/

  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    }
    if (err.name === 'MongoServerError') {
      next(new MongoDuplicateErr(err.message));
    } else {
      next(err);
    }
    /* if (error.name === 'ValidationError') {
      res
        .status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    if (error.code === MONGO_DUPLICATE) {
      res.status(DUPLICATE_USER).send({ message: 'Такой пользователь уже существует' });
    } */

    /* return res.status(500).send({ message: 'failed to register' });

    console.log(
      `При выполнении кода произошла ошибка ${error.name} c текстом ${error.message}. Смотри стэк: ${error.stack} `,
    ); */
  }
};

const createUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new BadRequestErr('Не передан email или password');
    }

    /* try { */
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({ email, password: hash });
    if (newUser) {
      return res.status(CREATED).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
        _id: newUser._id,
      });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Переданы некорректные данные'));
      /* res
        .status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' }); */
    }
    if (err.name === 'MongoServerError') {
      next(new MongoDuplicateErr(err.message));
      /* res.status(DUPLICATE_USER).send({ message: 'Такой пользователь уже существует' }); */
    }
    next(err);
  /*  return res.status(500).send({ message: 'failed to register' }); */
  }
};
/*
const createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res
          .status(CREATED)
          .send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            _id: user._id,
          }));
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: 'Ошибка сервера' });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
        );
      }
    });
}; */

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(OK).send(users);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    }
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const userById = await User.findById(id);
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
    } else {
      next(err);
    }
  }
};

/*
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
}; */

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!req.user._id) {
      throw new NotFoundErr('Пользователь не найден');
    }
    return res.status(OK).send(user);
  } catch (err) {
    next(err);
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
    } else {
      next(err);
    }
  }
};
  /*
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
      } else {
        res
          .status(OK)
          .send({
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
}; */

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
      res.status(OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};
  /*
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
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
}; */

module.exports = {
  getUsers,
  getUserById,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
