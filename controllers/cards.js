/* eslint-disable no-console */
const Card = require('../models/card');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  OK,
  CREATED,
} = require('../constants/errors');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(OK).send(cards))
    .catch((err) => {
      res
        .status(SERVER_ERROR)
        .send({ message: 'Ошибка сервера' });
      console.log(
        `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
      );
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId, { runValidators: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Невалидный id' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
        );
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(CREATED).send({
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: card.owner,
      _id: card._id,
    }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
        );
      }
    });
};

const setLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(OK).send({
          likes: card.likes,
          link: card.link,
          name: card.name,
          owner: card.owner,
          _id: card._id,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        console.log(err.name);
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
        );
      }
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Карточка не найдена' });
      } else {
        res.status(OK).send({
          likes: card.likes,
          link: card.link,
          name: card.name,
          owner: card.owner,
          _id: card._id,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
        console.log(
          `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
        );
      }
    });
};

module.exports = {
  getCards, deleteCardById, createCard, setLike, deleteLike,
};
