const createError = require('http-errors');

const sanitizeNewUserData = function(req, res, next) {
  let email = req.body.email;
  email = typeof(email) === 'string' && email.indexOf('@') > -1 ? email.trim() : undefined;

  let firstName = req.body.firstName;
  firstName = typeof(firstName) === 'string' && firstName.trim().length > 0 ? firstName.trim() : undefined;

  let lastName = req.body.lastName;
  lastName = typeof(lastName) === 'string' && lastName.trim().length > 0 ? lastName.trim() : undefined;

  let password = req.body.password;
  password = typeof(password) === 'string' && password.trim().length > 7 ? password.trim() : undefined;

  let tosAgreement = req.body.tosAgreement;
  tosAgreement = typeof(tosAgreement) === 'boolean' ? tosAgreement : undefined;

  if (email && firstName && lastName && password && tosAgreement) {
    req.email = email;
    req.firstName = firstName;
    req.lastName = lastName;
    req.password = password;
    delete req.body.password;
    next();
  } else {
    next(createError(400, 'Invalid data submitted for new user account'));
  }
}

module.exports = sanitizeNewUserData;