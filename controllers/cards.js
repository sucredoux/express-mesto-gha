const express = require('express');
const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, OK, CREATED } = require('../errors');

const getCards = (req, res) => {
    Card.find({})
        .populate(['owner', 'likes'])
        .then(cards => res.status(CREATED).send(cards))
        .catch((err) => {
            if(err.name === 'Validation Error') {
                res.status(BAD_REQUEST).send({ message:'Переданы некорректные данные' });
            } else {
                res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
                console.log(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `)
            }
        })
};

const deleteCardById = (req, res) => {
    const { _id: cardId } = req.params;
    Card.findByIdAndDelete(req.params.cardId)
        .then((card) => {
            if(!card) {
                throw new Error('Запрашиваемые данные не найдены');
            } else {
                res.status(OK).send({
                    likes: card.likes,
                    link: card.link,
                    name: card.name,
                    owner: card.owner,
                    _id: card._id
                })
            }        })
            .catch((err) => {
                if(err.name === 'Cast Error') {
                    res.status(BAD_REQUEST).send({ message: 'Невалидный id' });
                } else {
                    res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
                    console.log(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `)
                }
            })
}

const createCard = (req, res) => {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    Card.create({ name, link, owner: ownerId })
        .then(card => res.status(OK).send({
            likes: card.likes,
            link: card.link,
            name: card.name,
            owner: card.owner,
            _id: card._id
        }))
        .catch((err) => {
            if(err.name === 'Validation Error') {
                res.status(BAD_REQUEST).send({ message: "Переданы некорректные данные"});
            } else {
                res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
                console.log(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `)
            }
        })
}

const setLike = (req, res) => {
    const { _id: cardId } = req.params;
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id} }, { new: true })
        .then((card) => {
            if(!card) {
                res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
            }
            res.status(OK).send({
                likes: card.likes,
                link: card.link,
                name: card.name,
                owner: card.owner,
                _id: card._id
            })
        })
        .catch((err) => {
            if(err.name === 'Validation Error') {
                res.status(BAD_REQUEST).send({ message: "Переданы некорректные данные"});
            } else {
                res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
                console.log(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `)
            }
        })
}

const deleteLike = (req, res) => {
    const { _id: cardId } = req.params;
    Card.findByIdAndUpdate(req.params.cardId, { $pull: {likes: req.user._id } }, { new: true })
        .then((card) => {
            if(!card) {
                res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
            }
            res.status(OK).send({
                likes: card.likes,
                link: card.link,
                name: card.name,
                owner: card.owner,
                _id: card._id
            })
        })
        .catch((err) => {
            if(err.name === 'Validation Error') {
                res.status(BAD_REQUEST).send({ message: "Переданы некорректные данные"});
            } else {
                res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
                console.log(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}. Смотри стэк: ${err.stack} `)
            }
        })
}

module.exports = { getCards, deleteCardById, createCard, setLike, deleteLike };