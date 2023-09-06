// экземпляр класса - ошибка авторизации
class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = AuthorizationError;
