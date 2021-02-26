require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const users = require('./lib/routes/users.js');
const tokens = require('./lib/routes/tokens.js');
const checks = require('./lib/routes/checks.js');
const config = require('./lib/config.js');
const workers = require('./lib/workers.js');

const mongoose = require('mongoose');
const Token = require('./lib/schemas/token');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use('/users', users);
app.use('/tokens', tokens);
app.use('/checks', checks);

const server = app.listen(config.httpPort, function() {
  console.log(`Server listening on port ${config.httpPort}`);
});

// Options are set to deal with deprecation warnings
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Start the background workers
workers.init();

// Shut down the app
process.on('SIGTERM', () => {
  shutdown();
});
process.on('SIGINT', () => {
  shutdown();
});

const shutdown = async function() {
  try {
    // Clear out the old tokens from the database
    await Token.deleteMany({});
  } catch (e) {
    console.log(`Error clearing tokens from database: ${e}`)
  } finally {
    // Close out the server, the database connection, and the program
    server.close(function() {
      console.log('Closing server');
      mongoose.connection.close(false, function() {
        console.log('Closing database connection');
        process.exit(0);
      });
    });
  }
};