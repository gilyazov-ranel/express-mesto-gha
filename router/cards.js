const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateCardJoi, validationCardId } = require('../utilit/validateCard');

router.get('/', getCards);
router.post('/', validateCardJoi, createCard);
router.delete('/:cardId', validationCardId, deleteCard);
router.put('/:cardId/likes', validationCardId, likeCard);
router.delete('/:cardId/likes', validationCardId, dislikeCard);

module.exports = router;
