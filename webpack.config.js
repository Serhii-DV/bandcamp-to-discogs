const path = require('path');
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const packageJson = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const fs = require('fs');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = env.prod === true;
  const isDevelopment = !isProduction;

  const config = {
    mode: isProduction ? 'production' : 'development',
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
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
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
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          loader: "source-map-loader",
          include: path.resolve(__dirname, 'src'),
        },
        {
          test: /\.json$/i,
          type: "asset/resource",
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new CssMinimizerPlugin(),
        new JsonMinimizerPlugin(),
        new TerserPlugin()
      ],
    },
    resolve: {
      extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new ESLintPlugin({
        configType: 'flat',
        fix: true
      }),
      new HtmlWebpackPlugin({
        template: "./src/popup/popup.ejs",
        filename: "popup.html",
        templateParameters: {
          tabContentBandcamp: fs.readFileSync('./src/popup/content/bandcamp.html', 'utf-8'),
          tabContentReleaseCard: fs.readFileSync('./src/popup/content/release-card_tab.html', 'utf-8'),
          tabContentReleases: fs.readFileSync('./src/popup/content/releases_tab.html', 'utf-8'),
          tabContentHistory: fs.readFileSync('./src/popup/content/history_tab.html', 'utf-8'),
          tabContentAbout: fs.readFileSync('./src/popup/content/about.html', 'utf-8'),
          templates: [
            fs.readFileSync('./src/popup/content/release-card.html', 'utf-8'),
          ]
        },
        minify: true,
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
                // version: MMDD.HHMMSS
                const version = new Date().toISOString().slice(5, 19).replace(/[-:T]/g, '').replace(/(.{4})(.{6})/, '$1.$2');
                manifest.name += ` [Dev ${version}]`;
                console.log("\n\nManifest name:", manifest.name, "\n");
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
      clean: true,
    },
    devtool: isDevelopment ? 'inline-source-map' : 'source-map',
    devServer: {
      static: isDevelopment ? './dist' : { directory: path.resolve(__dirname, 'dist') },
      devMiddleware: {
        writeToDisk: true,
      },
      hot: false,
    },
  };

  return config;
};
