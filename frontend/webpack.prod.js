const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '../public'),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
});
