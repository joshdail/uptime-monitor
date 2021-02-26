const createError = require('http-errors');

const sanitizeNewCheckData = function(req, res, next) {
  let protocol = req.body.protocol;
  protocol = typeof(protocol) === 'string' && ['https', 'http'].indexOf(protocol.toLowerCase()) > -1 ? protocol.toLowerCase() : undefined;
  let url = req.body.url;
  url = typeof(url) === 'string' && url.trim().length > 0 ? url.trim() : undefined;
  let method = req.body.method;
  method = typeof(method) === 'string' && ['post', 'get', 'put', 'patch', 'delete'].indexOf(method.toLowerCase()) > -1 ? method.toLowerCase() : undefined;
  let successCodes = req.body.successCodes;
  successCodes = typeof(successCodes) === 'object' && successCodes instanceof Array && successCodes.length > 0 ? successCodes : [200, 201, 202, 203, 204, 206, 207];
  let timeoutSeconds = req.body.timeoutSeconds;
  timeoutSeconds = typeof(timeoutSeconds) === 'number' && timeoutSeconds % 1 === 0 && timeoutSeconds >= 1 && timeoutSeconds <= 15 ? timeoutSeconds : 5;

  /*console.log(protocol);
  console.log(url);
  console.log(method);
  console.log(successCodes);
  console.log(timeoutSeconds);*/

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // So as not to inadvertently overwrite anything on the req object itself, encapsulate in a separate object
    req.newCheck = {
      protocol: protocol,
      url: url,
      method: method,
      successCodes: successCodes,
      timeoutSeconds: timeoutSeconds
    }
    next();
  } else {
    next(createError(400, 'Missing or invalid parameters for creating new check'));
  }
};

module.exports = sanitizeNewCheckData;