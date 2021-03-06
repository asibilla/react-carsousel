'use strict';

const path = require('path');

/**
 * [exports description]
 * @return {[type]} [description]
 */
module.exports = () => {
  return {
    mode: 'production',
    entry: [path.join(__dirname, 'src', 'index.js')],
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
    }
  };
};
