// const path = require('path'); // модуль - используем для разрешения доступа к папкам
const helmet = require('helmet'); // модуль для обеспечения безопасности приложения Express
const express = require('express'); // фреймворк для создания веб-приложений на Node.js
const mongoose = require('mongoose'); // модуль для работы с базой данных MongoDB
const { errors } = require('celebrate'); // мидлвэр для ошибок валидации полей
require('dotenv').config(); // модуль для получения данных из файла .env
// const cookieParser = require('cookie-parser'); // модуль чтения cookie

// логгер
const { requestLogger, errorLogger } = require('./middlewares/logger');

// CORS - для доступа к серверу с других доменов
const cors = require('./middlewares/cors');

// контроллеры для создания пользователя, аутентификации и авторизации
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

// маршруты для пользователей и карточек:
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

// валидаторы для роутов
const { signupValidator } = require('./validators/signup-validator');
const { signinValidator } = require('./validators/signin-validator');

// экземпляр класса с ошибкой
const NotFoundError = require('./errors/not-found-err'); // 404

// мидлвар для централизованной обработки ошибок
const errorHandler = require('./middlewares/error-handler');

const app = express(); // cоздаём объект приложения

// app.use(cookieParser()); // парсер для чтения cookie

app.use(cors); // доступ для других доменов

const { // для успешного прохождения тестов gitHub
  PORT = 3000,
  BD_URL = 'mongodb://localhost:27017/mestodb',
} = process.env; // свойство для доступа к переменным среды ОС

app.use(helmet()); // использование модуля безопасности

app.use(express.json()); // для сборки JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect(BD_URL, { // подключение к mongodb
  useNewUrlParser: true, // обеспечивает совместимость с будущими версиями MongoDB
}).then(() => console.log('Подключились к БД'));

// логгер запросов
app.use(requestLogger);

// роуты, не требующие авторизации
app.post('/signup', signupValidator, createUser); // регистрируемся
app.post('/signin', signinValidator, login); // заходим под пользователя

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use(userRouter);
app.use(cardRouter);

// логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate от валидации joi
app.use(errors());

app.use((req, res, next) => { // предупреждаем переход по отсутсвующему пути
  next(new NotFoundError('Путь не найден'));
});

// централизованный обработчик
app.use(errorHandler);

// app.use(express.static(path.join(__dirname, 'public'))); // делаем папку общедоступной
app.listen(PORT, () => {
  console.log(`Порт приложения: ${PORT}`);
});
