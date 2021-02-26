const sanitizeUserPatchInput = function(req, res, next) {

  let email = req.body.email;
  email = typeof(email) === 'string' && email.indexOf('@') > -1 ? email.trim() : undefined;

  let firstName = req.body.firstName;
  firstName = typeof(firstName) === 'string' && firstName.trim().length > 0 ? firstName.trim() : undefined;

  let lastName = req.body.lastName;
  lastName = typeof(lastName) === 'string' && lastName.trim().length > 0 ? lastName.trim() : undefined;

  let password = req.body.password;
  password = typeof(password) === 'string' && password.trim().length > 7 ? password.trim() : undefined;

  if (email) {
    req.email = email;
  }
  if (firstName) {
    req.firstName = firstName;
  }
  if (lastName) {
    req.lastName = lastName;
  }
  if (password) {
    req.password = password;
  }
  next();
};

module.exports = sanitizeUserPatchInput;