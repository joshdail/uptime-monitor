const Check = require('../../schemas/check');

const deleteCheck = async function(req, res, next) {
  try {
    // Remove the check reference from the users array
    user.checks.pull(req.params.checkName);
    await user.save();
    await Check.deleteOne({
      name: req.params.checkName
    });
    next();
  } catch (e) {
    next(createError(500, 'Error deleting check'));
  }
}

module.exports = deleteCheck;