const webpack = require('webpack');
const path = require('path');
 
module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    'babel-polyfill',
    './main.js',
  ],
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'rrdiagram.js',
    library: 'rrdiagram',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        join_vars: true,
        if_return: true
      },
      output: {
        comments: false
      }
    }),
  ],
};
