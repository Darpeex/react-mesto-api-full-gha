/* eslint-disable no-unused-vars */ // иначе ругается на неиспользованный 'next'
// спасибо за разбор ПР)
const errorHandler = (err, req, res, next) => { // здесь обрабатываем все ошибки
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({ // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка' // если статус кода 500
        : message, // иначе сообщение пришедшей ошибки
    });
};

module.exports = errorHandler;
