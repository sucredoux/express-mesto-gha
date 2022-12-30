const jwt = require('jsonwebtoken');
const { AuthErr } = require('../errors');

const { NODE_ENV = 'production', JWT_SECRET_KEY = 'h6RRM09zlXTRSOhZ5SHbrva' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthErr(AuthErr.message);
  }
  const token = authorization.replace('Bearer ', '');

  if (!token) {
    throw new AuthErr(AuthErr.message);
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev_secret');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new AuthErr(AuthErr.message);
    } else {
      next(err);
    }
  }
  req.user = payload;
  next();
};

module.exports = auth;
