// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // insert our rule before CRA’s own JS loaders
      webpackConfig.module.rules.unshift({
        test: /\.m?js$/,
        resolve: { fullySpecified: false },
      });
      return webpackConfig;
    },
  },
};
