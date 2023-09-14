const winston = require('winston');
const expressWinston = require('express-winston');

// создадим логгер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }), // записываем запросы в файл 'request.log'
  ],
  format: winston.format.json(), // в формате json
});

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }), // записываем ошибки запросов в файл 'error.log'
  ],
  format: winston.format.json(), // в формате json
});

module.exports = {
  requestLogger,
  errorLogger,
};
