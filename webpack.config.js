const path = require('path');

module.exports = {
  entry: {
    popup: './src/popup/popup.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
