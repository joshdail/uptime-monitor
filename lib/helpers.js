const helpers = {};

helpers.createRandomString = function(strLength) {
  let possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  for (let i = 0; i < strLength; i++) {
    let char = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    randomString += char;
  }
  return randomString;
};

module.exports = helpers;