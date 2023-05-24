/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const User = require('../models/user');

const messageDataError = 'Переданы некорректные данные ';
const messageNotUser = 'Пользователь по указанному _id не найден';
const messageError = 'Внутренняя ошибка сервера';
const badRequest = 400;
const notFound = 404;
const internslServerError = 500;
const created = 201;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => {
      res.status(internslServerError).send({ message: `${messageError}` });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('DocumentNotFoundError'))
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        return res.status(notFound).send({ message: `${messageNotUser}` });
      }
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: `${messageDataError}` });
      }
      res.status(internslServerError).send({ message: `${messageError}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(created).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: `${messageDataError}при создании пользователя` });
      }
      res.status(internslServerError).send({ message: `${messageError}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new Error('ValidationError'))
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: `${messageDataError} при обновлении профиля` });
      } if (err.name === 'Error') {
        return res.status(notFound).send({ message: `${messageNotUser}` });
      }
      res.status(internslServerError).send({ message: `${messageError}` });
    });
};

module.exports.updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new Error('DocumentNotFoundError'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: `${messageDataError}при обновлении аватара` });
      } if (err.name === 'Error') {
        return res.status(notFound).send({ message: `${messageNotUser}` });
      }
      res.status(internslServerError).send({ message: `${messageError}` });
    });
};
