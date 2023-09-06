const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных

const signinValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(2).max(30).required()
      .email(), // проверка на соответствие email
    password: Joi.string().min(2).max(30).required(),
  }),
});

module.exports = { signinValidator };
