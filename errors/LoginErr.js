class LoginErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.message = 'Неправильный email или пароль';
  }
}

module.exports = LoginErr;
