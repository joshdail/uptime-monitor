const Token = require('../../schemas/token');
const createError = require('http-errors');

const deleteToken = async function(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const tokenId = authHeader && authHeader.split(' ')[1];

    await Token.deleteOne({
      tokenId: tokenId
    });
  } catch (e) {
    return next(createError(403, 'Token does not exist'));
  }
}

module.exports = deleteToken;