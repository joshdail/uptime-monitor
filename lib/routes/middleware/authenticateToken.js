const Token = require('../../schemas/token');
const createError = require('http-errors');

const authenticateToken = async function(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const tokenId = authHeader && authHeader.split(' ')[1];

    const token = await Token.findOne({
      tokenId: tokenId
    });
    if (token && token.expires > Date.now()) {
      req.token = token;
      next();
    } else {
      return next(createError(403, 'Invalid token'));
    }
  } catch (e) {
    return next(createError(403, 'Missing token'));
  }
}

module.exports = authenticateToken;