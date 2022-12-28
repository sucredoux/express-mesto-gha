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

/*
const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes']);
    .then((cards) => res.status(OK).send(cards))
    .catch((err) => {
      res
        .status(SERVER_ERROR)
        .send({ message: 'Ошибка сервера' });
      console.log(
        `При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `,
      );
    });
}; */

const deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findOneAndDelete(
      {
        _id: req.params.cardId, owner: req.user._id,
      },
      { runValidators: true },
    );
    if (!card) {
      throw new NotFoundErr('Запрашиваемая карта не найдена');
    }
    if (!card.owner._id.equals(req.user._id)) {
      throw new ForbiddenErr('У Вас нет доступа');
    } else {
      return res.status(OK).send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Невалидный id'));
    } else {
      next(err);
    }
  }
};
/*
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
*/

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
    }
    else {
      next(err);
    }
  }
};
/*
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
}; */

const setLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
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
/*
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
}; */

const deleteLike = async (req, res, next) => {
  try {
    const cardDislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!cardDislike) {
      throw new NotFoundErr('Запрашиваемая карта не найдена');
    }
    return res.status(OK).send({
      likes: cardDislike.likes,
      link: cardDislike.link,
      name: cardDislike.name,
      owner: cardDislike.owner,
      _id: cardDislike._id,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};
/*
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
}; */

module.exports = {
  getCards, deleteCardById, createCard, setLike, deleteLike,
};
