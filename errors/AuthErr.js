class AuthErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.message = 'Неправильный email или password';
  }
}

module.exports = AuthErr;
