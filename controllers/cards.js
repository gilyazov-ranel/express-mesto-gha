/* eslint-disable no-bitwise */
/* eslint-disable consistent-return */
const Card = require('../models/card');

const isDataError = 'card validation failed:';
const isNotFound = 'Cast to ObjectId failed';
const messageDataError = 'Переданы некорректные данные ';
const messageNotCard = 'Карточка с указанным _id не найдена';
const messageNotFound = 'Передан несуществующий _id карточки';

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => res.status(500).send({ message: `${err.message}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.send(cards))

    .catch((err) => {
      if (~err.message.indexOf(isDataError)) {
        return res.status(400).send({ message: `${messageDataError}при создании карточки` });
      }
      res.status(500).send({ message: `${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (~err.message.indexOf(isNotFound)) {
        return res.status(404).send({ message: `${messageNotCard}` });
      }
      res.status(500).send({ message: `${err.message}` });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((cards) => {
    res.send(cards);
  })
    .catch((err) => {
      if (~err.message.indexOf(isDataError)) {
        return res.status(400).send({ message: `${messageDataError}для постановки лайка` });
      } if (err.message.indexOf(isNotFound)) {
        return res.status(404).send({ message: `${messageNotFound}` });
      }
      res.status(500).send({ message: `${err.message}` });
    });
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((cards) => {
    res.send(cards);
  })
    .catch((err) => {
      if (~err.message.indexOf(isDataError)) {
        return res.status(400).send({ message: `${messageDataError}для снятии лайка` });
      } if (~err.message.indexOf(isNotFound)) {
        return res.status(404).send({ message: `${messageNotFound}` });
      }
      res.status(500).send({ message: `${err.message}` });
    });
};
