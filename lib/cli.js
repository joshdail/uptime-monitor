const readline = require('readline');
const util = require('util');
const Check = require('./schemas/check');
const User = require('./schemas/user');
const events = require('events');
class _events extends events {}
let e = new _events();

const validInputs = [
  'man',
  'help',
  'exit',
  'users',
  'checks'
];

const cli = {};

// Event handlers
e.on('man', () => {
  cli.help();
});

e.on('help', () => {
  cli.help();
});

e.on('users', () => {
  cli.users();
});

e.on('checks', () => {
  cli.checks();
});

e.on('exit', () => {
  process.emit('SIGTERM');
});

// CLI commands
cli.help = function() {
  console.log('Coming soon');
};

cli.users = async function() {
  try {
    const result = await User.find({});
    result.forEach(function(user) {
      console.log(`\nName:          ${user.firstName} ${user.lastName}`);
      console.log(`Email:         ${user.email}`);
      console.log(`Signed up:     ${user.signedUpOn.split('T')[0]}\n`);
      console.log(`${user.firstName} ${user.lastName}'s checks:\n`);
      user.checks.forEach(function(check) {
        console.log(`${check}`);
      });
    });
  } catch (e) {
    console.log(`Error reading user data:\n\n${e}`);
  }
};

cli.checks = async function() {
  try {
    const result = await Check.find({});
    result.forEach(function(check) {
      console.log(`\nName:          ${check.name}`);
      console.log(`Protocol:      ${check.protocol}`);
      console.log(`Url:           ${check.url}`);
      console.log(`Method:        ${check.method}`);
      console.log(`Success codes: ${check.successCodes}`);
      console.log(`Timeout:       ${check.timeoutSeconds} seconds`);
      console.log(`Current state: ${check.state}`);
      console.log(`Last checked:  ${check.lastChecked.split('T')[0]}`);
    });
  } catch (e) {
    console.log(`Error reading check data:\n\n${e}`);
  }
};

cli.exit = function() {
  helpers.shutdown();
}

// Process input and init functions
cli.processInput = function(str) {
  if (str && typeof(str) === 'string') {
    if (validInputs.indexOf(str.toLowerCase()) > -1) {
      e.emit(str.toLowerCase());
    } else {
      console.log(`Sorry, command not understood. Valid commands are: ${validInputs.join(', ')}`);
    }
  }
};

cli.init = function() {
  console.log('The cli is online');
  let interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
  });
  interface.on('line', function(str) {
    cli.processInput(str);
    interface.prompt();
  });
};

module.exports = cli;