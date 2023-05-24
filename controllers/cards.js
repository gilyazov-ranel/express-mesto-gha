/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */

const Card = require('../models/card');

const messageDataError = 'Переданы некорректные данные ';
const messageNotCard = 'Карточка с указанным _id не найдена';
const messageNotFound = 'Передан несуществующий _id карточки';
const messageError = 'Внутренняя ошибка сервера';
const badRequest = 400;
const notFound = 404;
const internslServerError = 500;
const created = 201;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => res.status(internslServerError).send({ message: `${messageError}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.status(created).send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: `${messageDataError}при создании карточки` });
      }
      res.status(internslServerError).send({ message: `${messageError}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('DocumentNotFoundError'))
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: `${messageNotCard}` });
      }
      if (err.name === 'Error') {
        return res.status(notFound).send({ message: `${messageNotFound}` });
      }
      res.status(internslServerError).send({ message: `${messageError}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error('DocumentNotFoundError'))
    .then((cards) => {
      res.send({ data: cards });
    }).catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: `${messageDataError}для постановки лайка` });
      } if (err.name === 'Error') {
        return res.status(notFound).send({ message: `${messageNotFound}` });
      }
      res.status(internslServerError).send({ message: `${messageError}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error('DocumentNotFoundError'))
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: `${messageDataError}для снятии лайка` });
      } if (err.name === 'Error') {
        return res.status(notFound).send({ message: `${messageNotFound}` });
      }
      res.status(internslServerError).send({ message: `${messageError}` });
    });
};
