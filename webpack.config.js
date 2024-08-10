const path = require('path');
const webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const packageJson = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  const isProduction = argv.mode === 'production';

  const config = {
    entry: {
      popup: './src/popup/popup.js',
      "bandcamp.content": './src/bandcamp/content.js',
      "discogs.content": './src/discogs/content.js',
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.(png|jpg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]',
          },
        },
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
        {
          test: /\.json$/i,
          type: "asset/resource",
        },
      ],
    },
    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
        new JsonMinimizerPlugin(),
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
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "popup", "popup.html"),
        filename: "popup.html",
        // Entry point scripts
        chunks: ["popup"]
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

              if (isDevelopment) {
                const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
                manifest.name += ` [Dev ${currentDateTime}]`;
              }

              return Buffer.from(JSON.stringify(manifest, null, "\t"));
            },
          },
          {
            from: "images/**",
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
          },
          {
            from: "src/data/discogs_genres.json",
            to: path.join(__dirname, "dist/data"),
            force: true,
          },
          {
            from: "src/data/keyword_mapping.json",
            to: path.join(__dirname, "dist/data"),
            force: true,
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

  if (isDevelopment) {
    config.devtool = 'inline-source-map';
    config.devServer.static = './dist';
  }

  if (isProduction) {
    config.devtool = 'source-map';
  }

  return config;
};