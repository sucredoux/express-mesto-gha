const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {
  SERVER_ERROR,
} = require('../constants/status');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator(v) {
        return /http(s?):\/\/(w{,3}\.)?(\w\W\.)*\w{2,3}(\/\w\W)*#?/.test(v);
      },
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return user;
    })
    .catch((err) => {
      res
        .status(SERVER_ERROR)
        .send({ message: 'Ошибка сервера' });
      console.log(
        `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
      );
    });
};

/*
userSchema.statics.findUserByCredentials = async function (email, password) {

  try {
    const user = await this.findOne({ email });
    if (!user) {
      return new AuthErr('Неправильный email или password');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return new AuthErr('Неправильный email или password');
    }
  } catch(err) {

  }
} */

module.exports = mongoose.model('user', userSchema);

/* err.name === 'ReferenceError'  - user is not defined */
