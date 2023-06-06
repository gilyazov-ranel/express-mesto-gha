/* eslint-disable no-unused-vars */

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  NotFoundError, Conflict,
} = require('../errors/collectionOfErrors');
const { errorCenter } = require('../middlewares/errorCenter');

const created = 201;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => errorCenter(err, req, res, next));
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id - не найден');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => errorCenter(err, req, res, next));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id - не найден');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => errorCenter(err, req, res, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, name, about, avatar, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      name,
      about,
      avatar,
      password: hash,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => {
      res.status(created).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(() => {
    throw new NotFoundError('Пользователь с таким id - не найден');
  })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => errorCenter(err, req, res, next));
};

module.exports.updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(() => {
    throw new NotFoundError('Пользователь с таким id - не найден');
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => errorCenter(err, req, res, next));
};
