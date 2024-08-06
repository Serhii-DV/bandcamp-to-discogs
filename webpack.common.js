const path = require('path');

module.exports = {
  entry: {
    vendors: './src/popup/vendors.js',
    popup: './src/popup/popup.js',
    "bandcamp-content": './src/bandcamp/modules/main.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: "source-map-loader"
      },
    ],
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
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
};
