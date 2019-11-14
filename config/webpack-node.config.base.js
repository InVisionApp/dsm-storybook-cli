const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  entry: {
    'dsm-storybook-node': './src/cli/index.js',
    utils: './src/api-utils.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    library: 'dsmStorybookNode',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.jsx', '.js', '.json']
  }
};
