const Article = require('../models/article');
const NotFoundError = require('../error/not-found-err');
const IncorrectError = require('../error/incorrect-error');
const NoRightsError = require('../error/no-rights-error');

// возвращает все сохранённые пользователем статьи
module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.send({ data: articles }))
    .catch(() => next(new IncorrectError()));
};

// создаёт статью с переданными в теле
// keyword, title, text, date, source, link и image
module.exports.createArticles = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.send({ data: article }))
    .catch(() => next(new IncorrectError()));
};

// удаляет сохранённую статью  по _id
module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      if (article.owner.toString() !== req.user._id) {
        throw new NoRightsError('Вы не владелец');
      }
      Article.findByIdAndRemove(req.params.articleId)
        .then((articleToRemove) => res.send({ data: articleToRemove }))
        .catch(next);
    })
    .catch(next);
};
