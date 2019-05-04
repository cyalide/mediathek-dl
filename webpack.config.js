const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: {
    filename: "./src/index.js"
  },
  output: {
    filename: "index.min.js",
    path: path.resolve(__dirname, "dist")
  },
  externals: [nodeExternals()],
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }]
  }
};
