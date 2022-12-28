const jwt = require('jsonwebtoken');
const { AuthErr } = require('../errors');

const { JWT_SECRET_KEY, NODE_ENV } = process.env;

const auth = (req, res, next) => {
  let payload;

  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AuthErr(AuthErr.message);
    }
    const token = authorization.replace('Bearer ', '');
    console.log(token);

    if (!token) {
      throw new AuthErr(AuthErr.message);
    }
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev_secret');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new AuthErr(AuthErr.message);
    } else {
      next(err);
    }
  }
  req.user = payload;
};
module.exports = auth;
