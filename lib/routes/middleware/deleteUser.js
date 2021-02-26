const User = require('../../schemas/user.js');
const createError = require('http-errors');

const deleteUser = async function(req, res, next) {
  try {
    await User.deleteOne({
      email: req.params.email
    });
    next();
  } catch (e) {
    next(createError(500, 'Error deleting user'));
  }
}

module.exports = deleteUser;