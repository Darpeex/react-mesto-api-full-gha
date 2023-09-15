const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken (jwt)

const { NODE_ENV, JWT_SECRET } = process.env; // достали константы из .env

const extractJwtToken = (authorization) => authorization.replace('jwt=', '');
const AuthorizationError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt; // записываем jwt в константу
  if (!authorization) {
    throw new AuthorizationError('Не получен токен из cookies');
  }
  const token = extractJwtToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
