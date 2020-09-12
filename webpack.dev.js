const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CreateFileWebpack = require('create-file-webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    open: true,
    writeToDisk: true,
    port: 8080,
  },
  plugins: [
    new CreateFileWebpack({
      path: './dist',
      fileName: 'settings.json',
      content: `{
        "serverUrl" : "http://localhost:8111",
        "auth" : {"username" : "root", "password" : "123456"},
        "branch" : "(default:true)",
        "buildTypes" : ["CiIndicatorTest_Build1", "CiIndicatorTest_Build2"],
        "updateStateInterval" : 10000
      }`,
    }),
  ],
});
