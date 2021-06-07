const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');

const app = express();


app.use(express.json());
app.use('/auth', authRoutes);
app.use('/food', foodRoutes);
app.use('/', mainRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb://localhost:27017/ditapp'
  )
  .then(result => {
    app.listen(8085);
  })
  .catch(err => console.log(err));
