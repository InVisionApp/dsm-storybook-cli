const webpack = require('webpack');
const _ = require('lodash');
const WebpackShellPlugin = require('webpack-shell-plugin');

const webpackConfigBase = require('./webpack.config.base');

const devWebpackConfig = {
  devtool: 'eval-source-map',
  plugins: [new WebpackShellPlugin({ dev: false, onBuildEnd: ['yalc publish --yarn --no-sig --force --push'] })]
};

module.exports = _.merge({}, webpackConfigBase, devWebpackConfig);
