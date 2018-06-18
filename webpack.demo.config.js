'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = () => {
  return {
    mode: 'development',
    entry: [path.join(__dirname, 'demo', 'index.js')],
    output: {
      filename: "index.js",
      path: path.join(__dirname, 'dist')
    },
    target: "web",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader"
            }
          ]
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "./index.html",
        template: path.join(__dirname, 'demo', 'index.html')
      })
    ]
  };
};
