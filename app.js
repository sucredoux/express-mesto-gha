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
/* const errorHandler = require('./middlewares/err-handler'); */



const { PORT } = process.env;

const app = express();
app.use(cookieParser());

mongoose.set('strictQuery', true);
app.use(cors());
/*app.use((req, res, next) => {
  req.user = {
    _id: '63979e4754ca05f806df21fb',
  };
  next();
});*/

app.use(express.json());
/*app.post('/signin', express.json(), login);
app.post('/signup', express.json(), createUser);*/

app.use(routes);

app.use((err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === SERVER_ERROR ? 'Ошибка сервера' : message });
});

/* app.use(errorHandler); */

async function connect() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
  console.log('Server connect db');
  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}
connect();
