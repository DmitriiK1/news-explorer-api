const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    minlength: 2,
    required: true,
  },
  title: {
    type: String,
    minlength: 2,
    required: true,
  },
  text: {
    type: String,
    minlength: 2,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  source: {
    type: String,
    minlength: 2,
    required: true,
  },
  link: {
    type: String,
    validator: (value) => validator.isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true }),
    required: true,
  },
  image: {
    type: String,
    validator: (value) => validator.isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true }),
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
