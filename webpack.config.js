const path = require('path');

module.exports = {
  entry: {
    vendors: './src/popup/vendors.js',
    popup: './src/popup/popup.js',
    "bandcamp-content": './src/bandcamp/modules/main.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    devMiddleware: {
      writeToDisk: true,
    },
    hot: false,
  },
  devtool: 'source-map',
};
