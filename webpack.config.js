/*eslint-disable*/
const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = (env) => {
  return {
    target: "node",

    entry: path.resolve(__dirname, "./src/index.ts"),
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env", "@babel/preset-typescript"],
                plugins: ["@babel/plugin-proposal-class-properties"],
              },
            },
            {
              loader: "ts-loader",
            },
          ],
        },
      ],
    },
    node: {
      global: false,
      __filename: false,
      __dirname: false,
    },
    resolve: {
      extensions: ["*", ".ts"],
    },
    externals: [nodeExternals()],
    output: {
      path: path.resolve(__dirname, "./dist"),
      publicPath: "/",
      filename: "bundle.js",
    },
  };
};
