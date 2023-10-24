const path = require('path');

module.exports = {
  entry: {
    vendors: './src/popup/vendors.js',
    popup: './src/popup/popup.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
};
