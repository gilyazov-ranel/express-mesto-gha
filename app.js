const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const routersUser = require('./router/users');
const routersCard = require('./router/cards');

const db = 'mongodb://127.0.0.1:27017/mestodb';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(db)
  // eslint-disable-next-line no-unused-vars
  .then((res) => console.log('База даннных подключена'))
  .catch(((error) => console.log(error)));

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '646cfd4f3dd142a1802843f3',
  };

  next();
});

app.use('/cards', routersCard);
app.use('/users', routersUser);
app.use((req, res, next) => {
  next(res.status(404).send({ message: 'Путь не найден' }));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
