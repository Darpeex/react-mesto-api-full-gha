const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken (jwt)

const { NODE_ENV, JWT_SECRET } = process.env; // достали константы из .env

// функции достаёт jwt из заголовка убирая 'jwt= '
const extractJwtToken = (authorization) => authorization.replace('jwt=', '');
const AuthorizationError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const authorization = req.headers.cookie; // из ответа получаем токен
  // проверяем есть ли он или начинается ли с jwt= (тип токена аутентификации)
  if (!authorization || !authorization.startsWith('jwt=')) {
    throw new AuthorizationError('Не получен токен из ответа');
  }
  // если с полученым токеном всё в порядке
  const token = extractJwtToken(authorization); // в переменную записывается только jwt
  let payload; // у let блочная область видимости, чтобы payload был виден снаружи объявляем до try

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'); // проверяем подпись токена и расшифровываем
    req.user = payload; // записываем пейлоуд в объект запроса
    next(); // пееркидываем в обработчик catch
  } catch (err) {
    next(err); // перекидываем в центролизованный обработчки
  }
};
