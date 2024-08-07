const { merge } = require('webpack-merge');
const common = require('./webpack.dev.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  entry: {
    vendors: './src/popup/vendors.js',
    popup: './src/popup/popup.js',
  },
  output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/popup'),
      publicPath: '/popup/',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist/popup'),
    compress: true,
    port: 9000,
    hot: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/popup/popup.html",
          to: path.join(__dirname, "dist"),
          force: true,
        },
        {
          from: "src/popup/popup.css",
          to: path.join(__dirname, "dist"),
          force: true,
        },
        {
          from: "src/popup/content/about.html",
          to: path.join(__dirname, "dist/content"),
          force: true,
        },
        {
          from: "src/popup/content/dashboard.html",
          to: path.join(__dirname, "dist/content"),
          force: true,
        },
        {
          from: "src/popup/content/discogs_tab.html",
          to: path.join(__dirname, "dist/content"),
          force: true,
        },
        {
          from: "src/popup/content/history_tab.html",
          to: path.join(__dirname, "dist/content"),
          force: true,
        },
        {
          from: "src/popup/content/release_tab.html",
          to: path.join(__dirname, "dist/content"),
          force: true,
        },
        {
          from: "src/popup/content/releases_tab.html",
          to: path.join(__dirname, "dist/content"),
          force: true,
        }
      ]
    })
  ]
});
