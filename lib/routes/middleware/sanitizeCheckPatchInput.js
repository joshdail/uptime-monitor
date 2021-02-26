const sanitizeCheckPatchInput = function(req, res, next) {
  let protocol = req.body.protocol;
  protocol = typeof(protocol) === 'string' && ['https', 'http'].indexOf(protocol) > -1 ? protocol : undefined;

  let url = req.body.url;
  url = typeof(url) === 'string' && url.trim().length > 0 ? url.trim() : undefined;

  let method = req.body.method;
  method = typeof(method) === 'string' && ['post', 'get', 'put', 'patch', 'delete'].indexOf(method.toLowerCase()) > -1 ? method.toLowerCase() : undefined;

  let successCodes = req.body.successCodes;
  successCodes = typeof(successCodes) === 'object' && successCodes instanceof Array && successCodes.length > 0 ? successCodes : undefined;

  let timeoutSeconds = req.body.timeoutSeconds;
  timeoutSeconds = typeof(timeoutSeconds) === 'number' && timeoutSeconds % 1 === 0 && timeoutSeconds >= 1 && timeoutSeconds <= 15 ? timeoutSeconds : undefined;

  req.updatedFields = {
    protocol: protocol,
    url: url,
    method: method,
    successCodes: successCodes,
    timeoutSeconds: timeoutSeconds
  }
  console.log(req.updatedFields);
  next();
}

module.exports = sanitizeCheckPatchInput;