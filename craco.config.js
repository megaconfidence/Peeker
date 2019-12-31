const path = require('path');

module.exports = function({ env, paths }) {
  return {
    webpack: {
      alias: {
        environment: path.join(
          __dirname,
          'src',
          'config',
          process.env.CLIENT_ENV
        )
      }
    }
  };
};
