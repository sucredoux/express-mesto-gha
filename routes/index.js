const express = require('express');
const userRoutes = require('./users');
const routes = express.Router();

routes.use('/users', userRoutes)

routes.get('/', (req, res) => {
    res.send('Hello, world!')
})

routes.post('/', express.json(), (req, res) => {
    res.send(req.body);
})


module.exports = routes ;
