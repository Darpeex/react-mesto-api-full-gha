const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных
const router = require('express').Router(); // создание нового экземпляра маршрутизатора вместо app

const {
  getUsers, getUserById, getUserInfo, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers); // возвращает всех пользователей
router.get('/users/me', getUserInfo); // возвращает информацию о текущем пользователе
router.get('/users/:userId', celebrate({ // возвращает пользователя по _id
  params: Joi.object().keys({ // проверяет req.params на соответсвие
    userId: Joi.string().length(24).hex().required(), // hex() - от 0 до 9 и букв от A до F
  }),
}), getUserById);

router.patch( // обновляет профиль
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }).options({ abortEarly: false }), // проверяет все поля, даже если есть ошибка в одном из них
  }),
  updateUserInfo,
);

router.patch( // обновляет аватар
  '/users/me/avatar',
  celebrate({
    body: Joi.object({
      avatar: Joi.string().uri().required() // ниже паттерн с регулярным выражением
        .pattern(/^(http|https):\/\/(www\.)?[a-zA-Z0-9\--._~:/?#[\]@!$&'()*+,;=]+#?$/),
    }).options({ abortEarly: false }), // проверяет все поля, даже если есть ошибка в одном из них
  }),
  updateUserAvatar,
);

module.exports = router;
