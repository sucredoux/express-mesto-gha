const express = require('express');
const {
  getCards, deleteCardById, createCard, setLike, deleteLike,
} = require('../controllers/cards');
const { validateCardInfo } = require('../middlewares/validation');

const cardRoutes = express.Router();

cardRoutes.get('/', getCards);
cardRoutes.delete('/:cardId', deleteCardById);
cardRoutes.post('/', validateCardInfo, createCard);
cardRoutes.put('/:cardId/likes', setLike);
cardRoutes.delete('/:cardId/likes', deleteLike);

module.exports = cardRoutes;
