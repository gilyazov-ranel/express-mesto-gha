/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const { Forbidden, NotFoundError } = require('../errors/collectionOfErrors');
const { errorCenter } = require('../middlewares/errorCenter');
const Card = require('../models/card');

const created = 201;

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => errorCenter(err, req, res, next));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.status(created).send(cards))
    .catch((err) => errorCenter(err, req, res, next));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        throw new Forbidden('Вы не можете удалить чужую карточку');
      }
      Card.findByIdAndRemove(card._id.toString())
        .then((card) => res.send(card)).catch(next);
    })
    .catch((err) => errorCenter(err, req, res, next));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => {
    throw new NotFoundError('Передан несуществующий _id карточки');
  })
    .then((cards) => {
      res.send({ data: cards });
    }).catch((err) => errorCenter(err, req, res, next));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => {
    throw new NotFoundError('Передан несуществующий _id карточки');
  })
    .then((cards) => {
      res.send({ data: cards });
    }).catch((err) => errorCenter(err, req, res, next));
};
