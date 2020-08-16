const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const AuthError = require('../error/auth-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    validator: (v) => validator.isEmail(v),
    required: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 2,
    maxlength: 30,
    select: false,
  },
});
function preSave(next) {
  const user = this;

  // только хэширование пароля, если он был изменен (или является новым)
  if (!user.isModified('password')) return next();

  // хэшируйте пароль, используя нашу новую соль
  return bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    // переопределяем пароль открытого текста хешированным
    user.password = hash;
    return next();
  });
}
userSchema.pre('save', preSave);
userSchema.statics = {
  findCheckPassword(email, password) {
    return this.findOne({ email }).select('+password')
      .then((user) => {
        if (!user) {
          throw new AuthError('Неправильные почта или пароль');
        }
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              // хеши не совпали — отклоняем промис
              throw new AuthError('Неправильные почта или пароль');
            }
            return user;
          });
      });
  },
};

module.exports = mongoose.model('user', userSchema);
