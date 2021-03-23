const readline = require('readline');
const util = require('util');
const logs = require('./logs');
const Check = require('./schemas/check');
const User = require('./schemas/user');
const events = require('events');
class _events extends events {}
let e = new _events();

const validInputs = [
  'man',
  'help',
  'exit',
  'cls',
  'users',
  'checks',
  'logs'
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

e.on('cls', () => {
  process.emit('SIGTERM');
});

e.on('logs', () => {
  cli.logs();
});

// CLI commands
cli.help = function() {
  console.log('\n############ UPTIME MONITOR CLI ############\n');
  console.log('               Valid commands\n');
  console.log('help / man               Show this help page');
  console.log('users                    Show all users');
  console.log('checks                   Show all checks');
  console.log('exit / cls               Exit the CLI');
  console.log('logs                     Show log filenames');
  console.log('display {filename} Show contents of log file')
  console.log('\n############################################\n');
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

cli.logs = async function() {
  try {
    let fileNames = await logs.list();
    console.log('\n');
    // console.log("Log file names are listed below...");
    fileNames.forEach(function(file) {
      console.log(file);
    });
  } catch (e) {
    console.log(`Error retrieving log file names:\n\n${e}`);
  }
};

cli.determineLogType = function(filename) {
  let splitFilename = filename.split('.');
  if (splitFilename.length === 2 && splitFilename[1] === 'log') {
    cli.loadLogData(filename);
  } else if (splitFilename.length === 3 && splitFilename[1] === 'gz' && splitFilename[2] === 'b64') {

  } else {
    console.log('Log file name must include the .log or .gz.b64 extension');
  }
};

cli.decompressLog = async function(filename) {
  console.log(`Compressed log file ${filename} successfully passed to decompressLog method`);
  console.log('This functionality is coming soon. SORRY');
};

cli.loadLogData = async function(filename) {
  try {
    let logData = await logs.open(filename);
    if (logData !== '') {
      let logsArray = logData.split('\n');
      cli.displayLogs(logsArray);
    } else {
      console.log('This log file exists, but it is empty');
    }
  } catch (e) {
    console.log(e);
  }
};

cli.displayLogs = function(logsArray) {
  console.log('Begin log file\n');
  for (let arrayItem of logsArray) {
    if (arrayItem === '') {
      continue;
    }
    try {
      let entry = JSON.parse(arrayItem).check;
      console.log(`Entry for timestamp ${entry.lastChecked}:\n`);
      console.log(`Protocol:      ${entry.protocol}`);
      console.log(`Url:           ${entry.url}`);
      console.log(`Method:        ${entry.method}`);
      console.log(`Success codes: ${entry.successCodes}`);
      console.log(`Timeout:       ${entry.timeoutSeconds} seconds`);
      console.log(`Current state: ${entry.state}\n`);
    } catch (e) {
      console.log(`Error parsing one of the log entries. Skipping`);
    }
  }
  console.log('End of log file');
};

// Process input and init functions
cli.processInput = function(str) {
  if (str && typeof(str) === 'string') {
    if (validInputs.indexOf(str.toLowerCase()) > -1) {
      e.emit(str.toLowerCase());
    } else if (str.split(' ')[0].toLowerCase() === 'display' && str.split(' ')[1]) {
      // Pass on only the presumed file name
      cli.determineLogType(str.split(' ')[1]);
    } else {
      console.log(`Sorry, command not understood. Valid commands are: ${validInputs.join(', ')}, display {filename}`);
    }
  }
};

cli.init = function() {
  console.log('The cli is online');
  let interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  interface.on('line', function(str) {
    cli.processInput(str);
    interface.prompt();
  });
};

module.exports = cli;