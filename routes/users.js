const { /* celebrate, */ Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
//  getUsers,
  getUser,
} = require('../controllers/users');

router.get('/me', auth, getUser); // возвращает информацию о пользователе (email и имя)

// router.get('/:userId', auth, celebrate({
//   params: Joi.object().keys({
//     userId: Joi.objectId().required(),
//   }),
// }), getUser);

module.exports = router;
