const express = require('express');
const {
  getCards, deleteCardById, createCard, setLike, deleteLike,
} = require('../controllers/cards');

const cardRoutes = express.Router();

cardRoutes.get('/', getCards);
cardRoutes.delete('/:cardId', deleteCardById);
cardRoutes.post('/', express.json(), createCard);
cardRoutes.put('/:cardId/likes', express.json(), setLike);
cardRoutes.delete('/:cardId/likes', express.json(), deleteLike);

module.exports = cardRoutes;
