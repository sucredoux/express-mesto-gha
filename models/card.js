const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {

      validator(v) {
        return /http(s?):\/\/(w{,3}\.)?(\w\W\.)*\w{2,3}(\/\w\W)*#?/.test(v);
      },

    },
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],
    ref: 'likes',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);

/*
const initialCards = [
  {
    "name": "Манарола",
    "link: "https://images.unsplash.com/flagged/photo-1557479962-a7c7afdf86e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1hbmFyb2xhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    "name": "Мыс Доброй Надежды",
    "link": "https://images.unsplash.com/photo-1645212763353-601f622d90ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FwZSUyMG9mJTIwZ29vZCUyMGhvcGUlMjBwZW5pbnN1bGF8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
  },
  {
    "name": "Антарктика",
    "link": "https://images.unsplash.com/photo-1551415923-31d2072bc248?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDF8fGFudGFydGljYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    "name": "Камчатка",
    "link": "https://images.unsplash.com/photo-1612257460705-e0d24b7a4808?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8a2FtY2hhdGthfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: 'Новая Зеландия',
    link: 'https://images.unsplash.com/photo-1593384754621-c058e0fc093c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bmV3JTIwemVhbGFuZCUyMGJheXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: 'Перу',
    link: 'https://images.unsplash.com/photo-1533049060588-ef73e35d5f8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHBlcnUlMjBvY2VhbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
  }
]; */
