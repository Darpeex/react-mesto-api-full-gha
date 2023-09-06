const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных

const signupValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png')
      .pattern(/^(https?:\/\/)?(?:www\.)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/), // паттерн регулярки
  }),
});

module.exports = { signupValidator };
