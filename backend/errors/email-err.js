// экземпляр класса - ошибка существования email'a
class EmailExistenceError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = EmailExistenceError;
