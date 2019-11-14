const path = require('path');

module.exports = {
  entry: {
    'dsm-storybook': './src/addons/index.js',
    register: './src/addons/register.js',
    'web-dsm-storybook-utils': './src/web-index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    library: 'dsmStorybook',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css)$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      }
    ]
  },
  // Externals all @storybook packages
  externals: [/@storybook/, 'react'],
  resolve: {
    extensions: ['.jsx', '.js', '.json']
  }
};
