/* eslint-disable func-names */ // чтобы не ругался на функцию строка '50'
const mongoose = require('mongoose'); // нужна для создании схем
const bcrypt = require('bcrypt'); // импортируем bcrypt для хеширования
const validator = require('validator'); // библиотека для валидации данных

// Создаём схему и задаём её поля
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // при не соответствии условиям в [] - выдаются ошибки
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: { // проверка на соответствие url
        validator: (value) => validator.isURL(value),
        message: 'Некорректный URL',
      },
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
      validate: { // проверка на соответствие email
        validator: (value) => validator.isEmail(value),
        message: 'Некорректный Email',
      },
    },
    password: {
      type: String,
      select: false, // чтобы API не возвращал хеш пароля
      required: [true, 'Поле "password" должно быть заполнено'],
    },
  },
  { versionKey: false }, // убирает поле '__v' из ответа
);

// добавим findUserByCredentials схеме пользователя; функция не стрелочная, т.к. нам нужен this
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      if (!user) { // если не нашёлся — отклоняем промис
        return Promise.reject(new Error('Пользователь не найден'));
      } // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // если пароли не соответствуют - отклоняем промис
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user; // так user доступен
        });
    });
};

const User = mongoose.model('user', userSchema); // создание модели
module.exports = User; // экспорт модели
