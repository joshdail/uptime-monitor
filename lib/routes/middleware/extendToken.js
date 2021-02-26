const Token = require('../../schemas/token');
const createError = require('http-errors');

const extendToken = async function(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const tokenId = authHeader && authHeader.split(' ')[1];

    const token = await Token.findOne({
      tokenId: tokenId
    });
    if (token.expires > Date.now()) {
      token.expires = Date.now() + 3600000;
      await token.save();
      next();
    } else {
      return next(createError(400, 'Token is expired and cannot be extended'));
    }
  } catch (e) {
    return next(createError(403, 'Missing token'));
  }
}

module.exports = extendToken;