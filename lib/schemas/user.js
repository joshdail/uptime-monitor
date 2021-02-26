const mongoose = require('mongoose');

// Not saving the tos agreement, since anyone registered has accepted the agreement.
// There would be no reason for any user to have a false, null, or undefined value.
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  signedUpOn: {
    type: String,
    required: true
  },
  checks: {
    type: [String],
    required: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;