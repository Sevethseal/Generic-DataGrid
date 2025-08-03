module.exports = {
  // … your existing config …
  module: {
    rules: [
      // other rules…
      {
        test: /\.m?js$/, // for .js and .mjs files
        resolve: {
          fullySpecified: false, // allow bare imports like 'react/jsx-runtime'
        },
      },
    ],
  },
};
