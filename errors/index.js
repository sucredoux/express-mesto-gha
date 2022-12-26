const AuthErr = require('./AuthErr');
const NotFoundErr = require('./NotFoundErr');
const BadRequestErr = require('./BadRequestErr');
const DuplicateUserErr = require('./DuplicateUserErr');
const MongoDuplicateErr = require('./MongoDuplicateErr');

module.exports = {
  AuthErr,
  NotFoundErr,
  BadRequestErr,
  DuplicateUserErr,
  MongoDuplicateErr,
};
