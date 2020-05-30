const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.resolve(__dirname);
const devServer = {
  host: "192.168.2.104",
  port: 8080
};

const config = merge(common,{
  mode: "development",
  entry: {
    app: path.resolve(rootDir, "src", "static", "main.js")
  },
  output: {
    path: path.resolve(rootDir, "build"),
    filename: path.join("js", "main.js")
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(rootDir, "public"),
    publicPath: "/",
    host: devServer.host,
    port: devServer.port,
    disableHostCheck: true,
    stats: "errors-only",
    // noInfo: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    },
    liveReload: true
  }
});

config.plugins =
[
  new HtmlWebpackPlugin({
    template: path.join("src", "static", "index.html"),
    filename: 'index.html',
    inject: "body"
  })
];

module.exports = config;
