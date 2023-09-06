const Card = require('../models/card'); // импортируем модель

// классы с ответами об ошибках
const RequestError = require('../errors/req-err'); // 400
const OwnerCardError = require('../errors/owner-err'); // 403
const NotFoundError = require('../errors/not-found-err'); // 404

// возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards })) // успешно, возвращаем карточки
    .catch(next); // переходим в центролизованный обработчик
};

// создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body; // данные из тела запроса
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => { // если введённые данные некорректны, передаём сообщение об ошибке и код '400'
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные карточки'));
      }
      return next(err); // иначе, передаём ошибку в централизованный обработчик
    });
};

// удаляет карточку по идентификатору
module.exports.deleteCard = (req, res, next) => {
  // req.params содержит параметры маршрута, которые передаются в URL
  const { cardId } = req.params; // извлекаем значение cardId из объекта req.params
  return Card.findById({ _id: cardId })
    .orFail(new Error('CardNotFound'))
    .then((card) => {
      const userId = req.user._id; // строчный тип - далее сравниваем
      const cardUserId = card.owner.toString(); // привели к строчному типу

      if (userId !== cardUserId) {
        throw new OwnerCardError('Вы можете удалить только свою карточку');
      }
      return Card.deleteOne(card)
        .then(() => res.status(200).send({ message: 'Карточка успешно удалена' }));
    })
    .catch((err) => {
      if (err.message === 'CardNotFound') {
        next(new NotFoundError('Карточка не найдена'));
      }
      if (err.name === 'CastError') {
        next(new RequestError('Некорректный Id карточки'));
      }
      return next(err); // передаём ошибку в централизованный обработчик
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }, // new - возвращает обновленный документ
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(200).send({ message: 'Лайк поставлен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректный Id карточки'));
      }
      return next(err); // передаём ошибку в централизованный обработчик
    });
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }, // new - возвращает обновленный документ
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(200).send({ message: 'Лайк удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректный Id карточки'));
      }
      return next(err); // передаём ошибку в централизованный обработчик
    });
};
