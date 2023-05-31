/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

module.exports.getUserId = (req, res, next) => {
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

      next();
    });
};

module.exports.getCurrentUser = (req, res) => {
  console.log(req.user);
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: 'Неправильные почта или пароль' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
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
