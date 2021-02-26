const User = require('../../schemas/user');
const createError = require('http-errors');

const saveNewUser = async function(req, res, next) {
  let signedUpOn = new Date().toISOString();
  const user = new User({
    email: req.email,
    firstName: req.firstName,
    lastName: req.lastName,
    password: req.password,
    salt: req.salt,
    signedUpOn: signedUpOn,
    checks: []
  });
  // Make sure this user does not already exist
  const result = await User.findOne({
    email: user.email
  });
  if (!result) {
    await user.save();
    req.result = {
      email: req.email,
      firstName: req.firstName,
      lastName: req.lastName,
      signedUpOn: req.signedUpOn
    };
    next();
  } else {
    throw createError(400, 'A user with this email already exists');
  }
}

module.exports = saveNewUser;