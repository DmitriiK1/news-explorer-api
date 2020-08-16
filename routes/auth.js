const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  createUser,
  login,
} = require('../controllers/users');

const validatePass = require('../regex/validate-pass');

const AuthError = require('../error/auth-err');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// создаёт пользователя с переданными в теле
// email, password и name
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(validatePass).error(() => new AuthError('Необходимо задать пароль, длинной не менее 8 символов содержащий цифры, строчные латинские буквы')),
  }),
}), createUser);

// проверяет переданные в теле почту и пароль
// и возвращает JWT
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(validatePass).error(() => new AuthError('Необходимо задать пароль, длинной не менее 8 символов содержащий цифры, строчные латинские буквы')),
  }),
}), login);

module.exports = router;
