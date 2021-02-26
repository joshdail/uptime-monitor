const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  // Calling it "tokenId" so as not to conflict with mongoDB
  tokenId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  expires: {
    type: Number,
    required: true
  }
});

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;