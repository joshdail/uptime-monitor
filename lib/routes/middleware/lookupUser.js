const User = require('../../schemas/user');
const createError = require('http-errors');

const lookupUser = async function(req, res, next) {
  try {
    const data = await User.findOne({
      email: req.params.email
    });
    if (data._id.toString() === req.token.userId) {
      req.userData = data;
      req.result = {
        email: req.userData.email,
        firstName: req.userData.firstName,
        lastName: req.userData.lastName,
        signedUpOn: req.userData.signedUpOn,
        checks: req.userData.checks
      };
      next();
    } else {
      next(createError(403, 'Token does not match user'));
    }
  } catch (e) {
    next(createError(404, 'User not found'))
  }
}

module.exports = lookupUser;