const path = require('path');
const webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const packageJson = require('./package.json');

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
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          to: path.join(__dirname, "dist"),
          force: true,
          transform: function (content, path) {
            let manifest = JSON.parse(content.toString());
            manifest.version = packageJson.version;
            return Buffer.from(JSON.stringify(manifest, null, "\t"));
          },
        },
      ],
    }),
  ],
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
