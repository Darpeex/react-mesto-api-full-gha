const mongoose = require('mongoose'); // нужна для создании схем
const validator = require('validator'); // библиотека для валидации данных

// Создаём схему и задаём её поля
const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // при не соответствии условиям в [] - выдаются ошибки
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    link: {
      type: String,
      validate: { // проверка на соответствие url
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      required: [true, 'Поле "link" должно быть заполнено'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId, // тип данных для работы с идентификаторами(ObjectId)
      ref: 'User',
      required: [true, 'Удалить может только владелец карточки'],
    },
    likes: {
      type: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      ],
      default: [],
    },
    createdAt: { // поле для хранения даты и времени создания документа
      type: Date,
      default: Date.now, // возвращает текущую дату и время
    },
  },
  { versionKey: false }, // убирает поле '__v' из ответа
);

const Card = mongoose.model('card', cardSchema); // создание модели
module.exports = Card; // экспорт модели
