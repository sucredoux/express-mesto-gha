/* eslint-disable consistent-return */
/* eslint-disable no-console */
const Card = require('../models/card');
const {
  OK,
  CREATED,
} = require('../constants/status');
const { ForbiddenErr, NotFoundErr, BadRequestErr } = require('../errors');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(OK).send(cards);
  } catch (err) {
    next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      throw new NotFoundErr('Запрашиваемая карта не найдена');
    } else if (!card.owner._id.equals(req.user._id)) {
      throw new ForbiddenErr('У Вас нет доступа');
    } else {
      const cardToDelete = await Card.findByIdAndDelete(req.params.cardId, { runValidators: true });
      return res.status(OK).send(cardToDelete);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Невалидный id'));
    } else {
      next(err);
    }
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    return res.status(CREATED).send({
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: card.owner,
      _id: card._id,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const setLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      throw new NotFoundErr('Запрашиваемая карта не найдена');
    }
    return res.status(OK).send({
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: card.owner,
      _id: card._id,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const deleteLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      throw new NotFoundErr('Запрашиваемая карта не найдена');
    }
    return res.status(OK).send({
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: card.owner,
      _id: card._id,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getCards, deleteCardById, createCard, setLike, deleteLike,
};
