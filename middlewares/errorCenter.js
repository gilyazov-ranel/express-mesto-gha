/* eslint-disable consistent-return */
const { BadRequest, Conflict } = require('../errors/collectionOfErrors');

const errorCenter = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new BadRequest('Некорректный запрос или данные'));
  } if (err.code === 11000) {
    next(new Conflict('Пользователь с таким email уже существует'));
  }
  next(err);
};

module.exports = { errorCenter };
