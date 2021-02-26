const Check = require('../../schemas/check');
const User = require('../../schemas/user');
const createError = require('http-errors');
const helpers = require('../../helpers.js');
const config = require('../../config.js');

const saveNewCheck = async function(req, res, next) {
  try {
    const user = await User.findOne({
      _id: req.token.userId
    });
    if (user.checks.length >= config.maxChecks) {
      next(createError(400, `User has already reached limit of allowed checks (max ${config.maxChecks})`));
    } else {
      let name = user.firstName + user.lastName + '-' + helpers.createRandomString(16);
      const check = new Check({
        name: name,
        userId: user._id.toString(),
        protocol: req.newCheck.protocol,
        url: req.newCheck.url,
        method: req.newCheck.method,
        successCodes: req.newCheck.successCodes,
        timeoutSeconds: req.newCheck.timeoutSeconds
      });
      await check.save();
      user.checks.addToSet(check.name);
      await user.save();
      req.result = {
        name: check.name,
        protocol: check.protocol,
        url: check.url,
        method: check.method,
        successCodes: check.successCodes,
        timeoutSeconds: check.timeoutSeconds
      };
      next();
    }
  } catch (e) {
    next(createError(403, 'Invalid token submitted'));
  }
};

module.exports = saveNewCheck;