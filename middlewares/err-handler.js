const errorHandler = (err, req, res, next) => {
  console.log(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ошибка на стороне сервера'
  res.status(statusCode).send({ message: message });

  next();
}

module.exports. = errorHandler;