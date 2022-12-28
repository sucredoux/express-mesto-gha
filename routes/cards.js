const express = require('express');
const {
  getCards, deleteCardById, createCard, setLike, deleteLike,
} = require('../controllers/cards');
const { validateCardInfo } = require('../middlewares/validation');

const cardRoutes = express.Router();

cardRoutes.get('/', getCards);
cardRoutes.delete('/:cardId', validateCardInfo, deleteCardById);
cardRoutes.post('/', validateCardInfo, createCard);
cardRoutes.put('/:cardId/likes', validateCardInfo, setLike);
cardRoutes.delete('/:cardId/likes', validateCardInfo, deleteLike);

module.exports = cardRoutes;
