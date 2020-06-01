const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

const rootDir = path.resolve(__dirname);
const devServer = {
  host: "192.168.1.115",
  port: 8080
};

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "js/[name].js"
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(rootDir, "public"),
    publicPath: path.join("/"),
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
    liveReload: false
  },
  plugins: [
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       context: path.resolve(rootDir, "pubic"),
    //       // from: "img/poster01.png",
    //       from: path.resolve(rootDir, "build")
    //     }
    //   ],
    //   // options: {
    //   //   concurrency: 100,
    //   // },
    // })
  ],
  optimization: {
    minimize: false
  }
});
