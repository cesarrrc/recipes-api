class AppError extends Error {
  constructor(message, statusCode, sqlMessage) {
    super(message, sqlMessage);
    this.statusCode = statusCode;
    this.isOperational = true;
    console.log('constructor')
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
