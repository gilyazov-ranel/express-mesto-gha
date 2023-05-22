/* eslint-disable no-bitwise */
/* eslint-disable consistent-return */
const User = require('../models/user');

const isDataError = 'user validation failed:';
const isNotFound = 'Cast to ObjectId failed';
const messageDataError = 'Переданы некорректные данные ';
const messageNotUser = 'Пользователь по указанному _id не найден';

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => {
      if (~err.message.indexOf(isDataError)) {
        return res.status(400).send({ message: `${messageDataError}` });
      }
      res.status(500).send({ message: `${err.message}` });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (~err.message.indexOf(isNotFound)) {
        return res.status(404).send({ message: `${messageNotUser}` });
      }
      res.status(500).send({ message: `${err.message}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (~err.message.indexOf(isDataError)) {
        return res.status(400).send({ message: `${messageDataError}при создании пользователя` });
      }
      res.status(500).send({ message: `${err.message}` });
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
  )
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (~err.message.indexOf(isDataError)) {
        return res.status(400).send({ message: `${messageDataError} при обновлении профиля` });
      } if (~err.message.indexOf(isNotFound)) {
        return res.status(404).send({ message: `${messageNotUser}` });
      }
      res.status(500).send({ message: `${err.message}` });
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
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (~err.message.indexOf(isDataError)) {
        return res.status(400).send({ message: `${messageDataError}при обновлении аватара` });
      } if (~err.message.indexOf(isNotFound)) {
        return res.status(404).send({ message: `${messageNotUser}` });
      }
      res.status(500).send({ message: `${err.message}` });
    });
};
