
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['STUDENT', 'FACULTY'],
    default: 'STUDENT',
  },
  rollNumber: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
