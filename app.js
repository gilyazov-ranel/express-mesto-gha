/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routersUser = require('./router/users');
const routersCard = require('./router/cards');
const {
  createUser, login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const cardJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

const userJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(
      /https*\:\/\/w{0,3}\.*[a-z0-9\-]*\.ru[a-z0-9\/]*/,
    ),
  }),
});

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

app.post('/signup', userJoi, createUser);
app.post('/signin', userJoi, login);

app.use(auth);

app.use('/cards', cardJoi, routersCard);

app.use('/users', userJoi, routersUser);

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
