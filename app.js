/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.set('strictQuery', true);

app.use((req, res, next) => {
  req.user = {
    _id: '63979e4754ca05f806df21fb',
  };
  next();
});

app.use(routes);

async function connect() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
  console.log('Server connect db');
  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}
connect();
