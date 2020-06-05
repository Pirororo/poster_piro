const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.resolve(__dirname);

module.exports =
{
  entry: {
    app: path.resolve(rootDir, "src", "js", "app.js")
  },
  output: {
    path: path.resolve(rootDir, "build"),
    filename: "js/[name].js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      },

      {
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
       },
       {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new webpack.ProvidePlugin({
        "THREE": "three/build/three"
    }),
    // new CleanWebpackPlugin(["build"]),
    new HtmlWebpackPlugin({
        template: path.join("src","index.html"),
        filename: path.join("session", "index.html"),
        inject: "head"
    }),
    new HtmlWebpackPlugin({
      template: path.join("src","xr.html"),
      filename: path.join("session", "xr.html"),
      inject: "head"
    })
  ]
};