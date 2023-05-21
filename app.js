const express = require('express');
const mongoose = require('mongoose');
const routers = require('./router/users');
const routersCard = require('./router/cards');
const db = 'mongodb://127.0.0.1:27017/mestodb';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(db)
.then((res) => console.log("База даннных подключена"))
.catch((error => console.log(error)));

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64667117e877963f164e0817'
  };

  next();
});

app.use(routers);
app.use(routersCard);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});