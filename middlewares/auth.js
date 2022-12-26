const express = require('express');
const jwt = require('jsonwebtoken');
const { AUTH } = require('../constants/errors');

const { JWT_SECRET_KEY, NODE_ENV } = process.env;


const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(AUTH).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev_secret');
  } catch (err) {
    console.log(err.name);
  /*  if(err.name === 'JsonWebTokenError') {
      return res.status(403).send({ message: 'Нет доступа' });
    } */
    return res.status(AUTH).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

console.log(req.user);
  next();
};
module.exports = { auth };
