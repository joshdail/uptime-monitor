const helpers = require('../../helpers.js');
const Token = require('../../schemas/token.js');
const createError = require('http-errors');

const generateToken = async function(req, res, next) {
  try {
    let tokenId = helpers.createRandomString(32);
    const token = new Token({
      tokenId: tokenId,
      userId: req.data._id.toString(),
      expires: Date.now() + 3600000
    });
    req.tokenId = tokenId;
    await token.save();
    next();
  } catch (e) {
    next(createError(500, 'Error generating new token'));
  }
};

module.exports = generateToken;