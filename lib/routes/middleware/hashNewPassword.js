const crypto = require('crypto');
const helpers = require('../../helpers.js');

// This function is for salting and hashing new passwords, not for comparing or updating
const hashNewPassword = function(req, res, next) {
  let password = req.password;

  let salt = helpers.createRandomString(32);
  let hashedPassword = crypto.createHmac('sha512', salt).update(password).digest('hex');

  req.password = hashedPassword;
  req.salt = salt;
  next();
};

module.exports = hashNewPassword;