const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
console.log(process.env);

const app = express();

app.use((req, res, next) => {
    req.user = {
        _id: '6394a3d824730f09fa329cc8'
    }
    next();
});

app.use(routes);

async function connect() {
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
    console.log('Server connect db')
    await app.listen(PORT);
    console.log(`App listening on port ${PORT}`)
}
connect();