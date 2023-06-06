/* eslint-disable consistent-return */
const { BadRequest } = require('../errors/collectionOfErrors');

const errorCenter = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new BadRequest('Некорректный запрос или данные'));
    return;
  }
  next(err);
};

module.exports = { errorCenter };
