const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY, NODE_ENV } = process.env;

const generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev_secret', { expiresIn: '7d' });

module.exports = generateToken;
