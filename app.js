/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes/index');
const { auth } = require('./middlewares/auth');
const {
  BAD_REQUEST, NOT_FOUND, SERVER_ERROR, OK, CREATED, AUTH, DUPLICATE_USER, MONGO_DUPLICATE,
} = require('./constants/errors');
const errorHandler = require('./middlewares/err-handler');

const { PORT, MONGO_URL } = process.env;

const app = express();
app.use(cookieParser());

mongoose.set('strictQuery', true);
app.use(cors());

app.use(express.json());

app.use(routes);

/*
app.use((err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === SERVER_ERROR ? 'Ошибка сервера При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack}' : message });
    console.log(
      `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
    );
  next();
}); */

app.use(errorHandler);

async function connect() {
  await mongoose.connect(MONGO_URL);
  console.log('Server connect db');
  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}
connect();
