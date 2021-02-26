let envs = {};

envs.testing = {
  httpPort: 4000,
  envName: 'testing',
  maxChecks: 10,
};

envs.production = {
  httpPort: 5000,
  envName: 'production',
  maxChecks: 10,
};

let currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

let envToExport = typeof(envs[currentEnv]) === 'string' ? envs[currentEnv] : envs.testing;

module.exports = envToExport;