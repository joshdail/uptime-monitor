/*
This module handles and logs the status checks.
*/

const path = require('path');
const https = require('https');
const http = require('http');
const url = require('url');
const util = require('util');
const logs = require('./logs');

const Check = require('./schemas/check');

const workers = {};

module.exports = workers;

workers.gatherChecks = async function() {
  try {
    const checks = await Check.find({});
    if (checks && checks instanceof Array) {
      checks.forEach(function(check) {
        workers.sanitizeCheckData(check);
      });
    } else {
      let currentTime = new Date().toISOString();
      console.log('No checks on file as of ${currentTime}\n');
    }
  } catch (e) {
    console.log(`Error retrieving checks:\n\n${e}\n`);
  }
};

workers.sanitizeCheckData = function(check) {
  check.protocol = typeof(check.protocol) === 'string' && ['https', 'http'].indexOf(check.protocol.toLowerCase()) > -1 ? check.protocol.toLowerCase() : undefined;
  check.url = typeof(check.url) === 'string' && check.url.trim().length > 0 ? check.url.trim() : undefined;
  check.method = typeof(check.method) === 'string' && ['post', 'get', 'put', 'patch', 'delete'].indexOf(check.method.toLowerCase()) > -1 ? check.method.toLowerCase() : undefined;
  check.timeoutSeconds = typeof(check.timeoutSeconds) === 'number' && check.timeoutSeconds % 1 === 0 && check.timeoutSeconds >= 1 && check.timeoutSeconds <= 15 ? check.timeoutSeconds : 5;
  check.successCodes = typeof(check.successCodes) === 'object' && check.successCodes instanceof Array && check.successCodes.length > 0 ? check.successCodes : [200, 201, 202, 203, 204, 206, 207];
  check.state = typeof(check.state) == 'string' && ['up', 'down'].indexOf(check.state.toLowerCase()) > -1 ? check.state.toLowerCase() : 'down';
  check.lastChecked = typeof(check.lastChecked) == 'string' && check.lastChecked.trim() !== '' ? check.lastChecked.trim() : undefined;

  if (check.protocol && check.url && check.method) {
    workers.performCheck(check);
  } else {
    if (check.name) {
      console.log(`Check ${check.name} is not properly formatted. Skipping\n`);
    } else {
      console.log('One of the checks is not properly formatted. Skipping\n');
    }
  }
};

workers.performCheck = function(check) {

  let checkOutcome = {
    error: false,
    responseCode: false
  };

  let outcomeSent = false;

  let parsedUrl = url.parse(check.protocol + '://' + check.url, true);

  let requestDetails = {
    protocol: check.protocol + ':',
    hostname: parsedUrl.hostname,
    method: check.method.toUpperCase(),
    path: parsedUrl.path,
    timeout: check.timeoutSeconds * 1000
  };

  let moduleToUse = check.protocol === 'http' ? http : https;
  let req = moduleToUse.request(requestDetails, function(res) {
    checkOutcome.responseCode = res.statusCode;
    if (!outcomeSent) {
      workers.processCheckOutcome(check, checkOutcome);
      outcomeSent = true;
    }
  });
  // Bind to error and timeout events
  req.on('error', function(e) {
    // Add an error to the checkOutcome
    checkOutcome.error = {
      error: true,
      value: e
    };
    if (!outcomeSent) {
      workers.processCheckOutcome(check, checkOutcome);
      outcomeSent = true;
    }
  });
  req.on('timeout', function() {
    // Add an error to the checkOutcome
    checkOutcome.error = {
      error: true,
      value: 'timeout'
    };
    if (!outcomeSent) {
      workers.processCheckOutcome(check, checkOutcome);
      outcomeSent = true;
    }
  });
  req.end();
}; // end workers.performCheck

workers.processCheckOutcome = async function(check, checkOutcome) {
  try {
    let state = !checkOutcome.error && check.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';
    let lastChecked = new Date().toISOString();
    check.state = state;
    check.lastChecked = lastChecked;
    await check.save();
    workers.log(check, checkOutcome);
  } catch (e) {
    console.log(`Error saving check ${check.name}\n\n${e}`);
  }
};

workers.log = async function(check, checkOutcome) {
  try {
    let logData = {
      check: check,
      checkOutcome: checkOutcome
    };
    let stringifiedData = JSON.stringify(logData);
    await logs.append(check.name, stringifiedData);
  } catch (e) {
    console.log(`Error triggered in workers.log method:\n\n${e}`);
  }
};

// Set workers to run once per minute
workers.loop = function() {
  setInterval(function() {
    workers.gatherChecks()
  }, 1000 * 60);
}

workers.init = function() {
  console.log('Background workers are running\n');
  workers.gatherChecks();
  workers.loop();
};

module.exports = workers;