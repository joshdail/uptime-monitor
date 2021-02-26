const crypto = require('crypto');

const updateUser = async function(req, res, next) {
  const user = req.userData;

  if (req.email) {
    user.email = req.email;
  }
  if (req.firstName) {
    user.firstName = req.firstName;
  }
  if (req.lastName) {
    user.lastName = req.lastName;
  }
  if (req.password) {
    let hashedPassword = crypto.createHmac('sha512', user.salt).update(req.password).digest('hex');
    user.password = hashedPassword;
  }
  await user.save();
  next();
};

module.exports = updateUser;