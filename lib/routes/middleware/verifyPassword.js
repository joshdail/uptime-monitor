const User = require('../../schemas/user');
const crypto = require('crypto');
const createError = require('http-errors');

const verifyPassword = async function(req, res, next) {
  try {
    const data = await User.findOne({
      email: req.body.email
    });
    let hashedPassword = crypto.createHmac('sha512', data.salt).update(req.body.password).digest('hex');

    if (hashedPassword === data.password) {
      // I'm going to pass the data as it is. Not modifying it just yet, until I get the token working properly
      req.data = data;
      next();
    } else {
      return next(createError(401, 'Invalid password'));
    }
  } catch (e) {
    return next(createError(404, 'User not found'));
  }
}

module.exports = verifyPassword;