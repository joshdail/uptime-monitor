const Check = require('../../schemas/check');
const User = require('../../schemas/user');
const createError = require('http-errors');

const lookupCheck = async function(req, res, next) {
  try {
    const name = req.params.checkName;
    const user = await User.findOne({
      _id: req.token.userId
    });
    if (user.checks.indexOf(name) > -1) {
      const check = await Check.findOne({
        name: name
      });
      req.check = check;
      req.user = user;
      req.result = {
        name: check.name,
        protocol: check.protocol,
        url: check.url,
        method: check.method,
        successCodes: check.successCodes,
        timeoutSeconds: check.timeoutSeconds,
        state: check.state,
        lastChecked: check.lastChecked
      };
      next();
    } else {
      next(createError(404, 'No check with this name exists for the current user'));
    }
  } catch (e) {
    next(createError(403, 'Token invalid for this user'));
  }
}

module.exports = lookupCheck;