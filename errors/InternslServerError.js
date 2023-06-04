class InternslServerError extends Error {
  constructor(message) {
    super(message);
    this.errorMessage = message;
    this.statusCode = 500;
  }
}

module.exports = { InternslServerError };
