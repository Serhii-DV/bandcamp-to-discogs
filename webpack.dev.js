// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'development';

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
});
