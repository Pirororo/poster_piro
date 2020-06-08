const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyPlugin = require('copy-webpack-plugin');

const config = merge(common, {
  mode: "production",
  devtool: false,
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "public",
          to: ""
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    }
	}
});

config.module.rules[0] = {
  test: /\.scss$/,
  use: [
    "style-loader",
    {
      loader: "css-loader",
      options: {
        url: false,
        sourceMap: false
      }
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: false
      }
    }
  ]
};

module.exports = config;

