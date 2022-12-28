const AuthErr = require('./AuthErr');
const NotFoundErr = require('./NotFoundErr');
const BadRequestErr = require('./BadRequestErr');
const MongoDuplicateErr = require('./MongoDuplicateErr');
const ForbiddenErr = require('./ForbiddenErr');
const LoginErr = require('./LoginErr');

module.exports = {
  AuthErr,
  NotFoundErr,
  BadRequestErr,
  MongoDuplicateErr,
  ForbiddenErr,
  LoginErr,
};
