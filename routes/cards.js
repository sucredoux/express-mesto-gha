const express = require('express');
const {
  getCards, deleteCardById, createCard, setLike, deleteLike,
} = require('../controllers/cards');
const { validateCardInfo, validateId } = require('../middlewares/validation');

const cardRoutes = express.Router();

cardRoutes.get('/', getCards);
cardRoutes.delete('/:cardId', validateId, deleteCardById);
cardRoutes.post('/', validateCardInfo, createCard);
cardRoutes.put('/:cardId/likes', validateId, setLike);
cardRoutes.delete('/:cardId/likes', validateId, deleteLike);

module.exports = cardRoutes;
