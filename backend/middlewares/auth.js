const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken (jwt)

const { NODE_ENV, JWT_SECRET } = process.env; // достали константы из .env

// функции достаёт jwt из заголовка убирая 'jwt= '
const extractJwtToken = (authorization) => authorization.replace('jwt=', '');
const AuthorizationError = require('../errors/auth-err');

// сделано для проверки, потом удалить
const YOUR_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGZjMDU4NzkzYzRiY2U2MjZhMTcxOWYiLCJpYXQiOjE2OTQyMzgwOTMsImV4cCI6MTY5NDg0Mjg5M30.Pia2odWjd_A-XiJwnSeHL17TXYiX2ely1RCUlK_6dMU'; // вставьте сюда JWT, который вернул публичный сервер
const SECRET_KEY_DEV = JWT_SECRET; // вставьте сюда секретный ключ для разработки из кода
try {
  const payload = jwt.verify(YOUR_JWT, SECRET_KEY_DEV);
  console.log(payload);
  console.log('\x1b[31m%s\x1b[0m', `
Надо исправить. В продакшне используется тот же
секретный ключ, что и в режиме разработки.
`);
} catch (err) {
  if (err.name === 'JsonWebTokenError' && err.message === 'invalid signature') {
    console.log(
      '\x1b[32m%s\x1b[0m',
      'Всё в порядке. Секретные ключи отличаются',
    );
  } else {
    console.log(
      '\x1b[33m%s\x1b[0m',
      'Что-то не так',
      err,
    );
  }
}
// сделано для проверки, потом удалить

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
