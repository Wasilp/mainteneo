// vue.config.js

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;

module.exports = {
  configureWebpack: {
    // plugins: [new BundleAnalyzerPlugin()]
  },
  transpileDependencies: [/\/node_modules\/resize-detector\//],
  devServer: {
    disableHostCheck: true
  }
};
