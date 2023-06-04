/* eslint-disable no-unused-vars */
const express = require('express');
const { errors } = require('celebrate');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { validateUserJoi } = require('./utilit/validateUser');
const routersUser = require('./router/users');
const routersCard = require('./router/cards');
const {
  createUser, login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const notFound = '404';

const db = 'mongodb://127.0.0.1:27017/mestodb';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(db)
  .then((res) => console.log('База даннных подключена'))
  .catch(((error) => console.log(error)));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post('/signup', validateUserJoi, createUser);
app.post('/signin', validateUserJoi, login);

app.use(auth);

app.use('/cards', routersCard);

app.use('/users', routersUser);

app.use((req, res, next) => {
  next(res.status(notFound).send({ message: 'Путь не найден' }));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(errors());
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).send({ message: err.message });
});
