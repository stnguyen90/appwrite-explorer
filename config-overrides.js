module.exports = {
  webpack: function (config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          "react/jsx-runtime": "react/jsx-runtime.js",
          "react/jsx-dev-runtime": "react/jsx-dev-runtime.js",
        },
      },
    };
  },
};
