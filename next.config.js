const path = require('path');
module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // For prod this is extraneous, but for dev, this is 
      // added to avoid Invalid Hook Call warning when linking to other libs https://reactjs.org/warnings/invalid-hook-call-warning.html
      react: path.resolve('node_modules/react'),
    };
    return config;
  },
};
