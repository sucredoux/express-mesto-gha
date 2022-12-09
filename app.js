const express = require('express');
const path = require('path');
const routes = require('./routes/index');


const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
    console.log('method', req.method);
    next()
})

app.use('/users', routes);


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
}
)

/*
/*const __dirname = path.resolve();*/

/*console.log(__dirname);
app.use(express.static(path.join(__dirname, 'mesto')));
 */