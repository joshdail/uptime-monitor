const updateCheck = async function(req, res, next) {
  let check = req.check;
  console.log(req.updatedFields);

  if (req.updatedFields.protocol) {
    check.protocol = req.updatedFields.protocol;
  }
  if (req.updatedFields.url) {
    check.url = req.updatedFields.url;
  }
  if (req.updatedFields.method) {
    check.method = req.updatedFields.method;
  }
  if (req.updatedFields.successCodes) {
    check.successCodes = req.updatedFields.successCodes;
  }
  if (req.updatedFields.timeoutSeconds) {
    check.timeoutSeconds = req.updatedFields.timeoutSeconds;
  }
  await check.save();
  next();
}

module.exports = updateCheck;