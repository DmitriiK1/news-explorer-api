class IncorrectError extends Error {
  constructor(message) {
    super(message || 'Произошла ошибка');
    this.statusCode = 400;
  }
}

module.exports = IncorrectError;
