const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken (jwt)

const { NODE_ENV, JWT_SECRET } = process.env; // достали константы из .env

const extractJwtToken = (authorization) => authorization.replace('jwt=', '');
const AuthorizationError = require('../errors/auth-err');

const test = () => {
  const YOUR_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGZjMDU4NzkzYzRiY2U2MjZhMTcxOWYiLCJpYXQiOjE2OTQ0MzU5MjUsImV4cCI6MTY5NTA0MDcyNX0.0_NJHFF2GS8wH88_0iTwplWw02KUk3OHoBxg3rTuXTU'; // вставьте сюда JWT, который вернул публичный сервер
  const SECRET_KEY_DEV = JWT_SECRET; // вставьте сюда секретный ключ для разработки из кода
  try {
    const payload2 = jwt.verify(YOUR_JWT, SECRET_KEY_DEV);
    console.log(payload2);
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
};
test(); // Всё в порядке. Секретные ключи отличаются - на сервер тоже добавил, после ревью удалю)

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;
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

// Можно оставлю себе для примера на будущее?
// module.exports = (req, res, next) => {
//   const authorization = req.headers.cookie; // из ответа получаем токен
//   // проверяем есть ли он или начинается ли с jwt= (тип токена аутентификации)
//   if (!authorization || !authorization.startsWith('jwt=')) {
//     throw new AuthorizationError('Не получен токен из ответа');
//   }
//   // если с полученым токеном всё в порядке
//   const token = extractJwtToken(authorization); // в переменную записывается только jwt
//   let payload; // у let блочная область видимости,
//   // чтобы payload был виден снаружи объявляем до try

//   try { // ниже проверяем подпись токена и расшифровываем
//     payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
//     req.user = payload; // записываем пейлоуд в объект запроса
//     next(); // пееркидываем в обработчик catch
//   } catch (err) {
//     next(err); // перекидываем в центролизованный обработчки
//   }
// };
// };
