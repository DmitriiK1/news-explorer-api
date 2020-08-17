const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const router = require('express').Router();
const auth = require('../middlewares/auth');
const validateUrl = require('../regex/validate-url');
const IncorrectError = require('../error/incorrect-error');

const { getArticles, createArticles, deleteArticle } = require('../controllers/article');

router.get('/', auth, getArticles); // возвращает все сохранённые пользователем статьи

// создаёт статью с переданными в теле
// keyword, title, text, date, source, link и image
router.post('/', auth, celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2).max(30),
    date: Joi.date().required(),
    source: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(validateUrl).error(() => new IncorrectError('Неверный URL')),
    image: Joi.string().required().pattern(validateUrl).error(() => new IncorrectError('Неверный URL')),
  }),
}), createArticles);

// удаляет сохранённую статью  по _id
router.delete('/:articleId', auth, celebrate({
  params: Joi.object().keys({
    articleId: Joi.objectId().required(),
  }),
}), deleteArticle);

module.exports = router;
