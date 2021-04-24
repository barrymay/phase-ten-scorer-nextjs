// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const wp = require('@cypress/webpack-preprocessor');
module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);

  const options = {
    webpackOptions: {
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: require.resolve('babel-loader'),
            options: {
              presets: ['@babel/preset-typescript'],
              plugins: ['istanbul'],
            },
          },
        ],
      },
    },
  };
  on('file:preprocessor', wp(options));
  return config;
};
