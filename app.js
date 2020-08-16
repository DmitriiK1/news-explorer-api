require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./error/not-found-err');

mongoose.connect('mongodb://localhost:27017/diplom', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const article = require('./routes/article');
const users = require('./routes/users');
const auth = require('./routes/auth');

const app = express();
app.use(requestLogger); // подключаем логгер запросов

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', auth);
app.use('/articles', article);
app.use('/users', users);

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors());// обработчик ошибок celebrate

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use((err, req, res, next) => { // eslint-disable-line
  // next будет вызван с аргументом-ошибкой и запрос перейдёт в обработчик ошибки
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`); // eslint-disable-line
});
