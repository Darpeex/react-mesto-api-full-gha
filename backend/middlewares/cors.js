// самописный cors - но для простоты используют библиотеку cors
/* eslint-disable consistent-return */ // зачем-то ругается на стрелочную функцию
const router = require('express').Router(); // создание нового экземпляра маршрутизатора вместо app
// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://darpeex.nomoredomainsicu.ru',
  'http://darpeex.nomoredomainsicu.ru',
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
];

router.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
    // устанавливаем заголовок Access-Control-Allow-Credentials с значением true
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  // сохраняем список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end(); // end() т.к. тела ответа нет
  }
  next();
});

module.exports = router; // передумал использовать из-за сложностей, оставил для примера
