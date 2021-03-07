const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  protocol: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  successCodes: {
    type: [Number],
    required: true
  },
  timeoutSeconds: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    required: false
  },
  lastChecked: {
    type: String,
    required: false
  }
});

const Check = mongoose.model('Check', checkSchema);

module.exports = Check;