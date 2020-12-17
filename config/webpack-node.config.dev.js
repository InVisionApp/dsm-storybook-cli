const webpack = require('webpack');
const _ = require('lodash');
const WebpackShellPlugin = require('webpack-shell-plugin');

const webpackConfigBase = require('./webpack-node.config.base');

const devWebpackConfig = {
  devtool: false,
  plugins: [
    new WebpackShellPlugin({ dev: false, onBuildEnd: ['yalc publish --yarn --no-sig --force --push'] }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    })
  ]
};

module.exports = _.merge({}, webpackConfigBase, devWebpackConfig);
