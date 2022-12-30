const express = require('express');
const {
  getCards, deleteCardById, createCard, setLike, deleteLike,
} = require('../controllers/cards');
const { validateCardInfo, validateCardId } = require('../middlewares/validation');

const cardRoutes = express.Router();

cardRoutes.get('/', getCards);
cardRoutes.delete('/:cardId', validateCardId, deleteCardById);
cardRoutes.post('/', validateCardInfo, createCard);
cardRoutes.put('/:cardId/likes', validateCardId, setLike);
cardRoutes.delete('/:cardId/likes', validateCardId, deleteLike);

module.exports = cardRoutes;
