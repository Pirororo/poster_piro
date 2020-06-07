const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const rootDir = path.resolve(__dirname);

const config = merge(common, {
  mode: "production",
  entry: {
    app: path.resolve(rootDir, "src", "static", "main.js")
  },
  output: {
    path: path.resolve(rootDir, "build"),
    filename: path.join("js", "main.js")
  },
  devtool: false,
  optimization: {
    minimize: true
	}
});

config.module.rules[2] = {
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

config.plugins =
[
  new HtmlWebpackPlugin({
    template: path.join("src","static", "index.html"),
    filename: 'index.html',
    inject: "body"
  }),
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
  })
];

module.exports = config;