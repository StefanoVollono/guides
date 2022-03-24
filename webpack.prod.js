const path = require("path");
const buildPath = path.resolve(__dirname, "dist");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",

  entry: {
    background: './src/pkg/background.js',
    guides: "./src/pkg/guides.js",
  },

  output: {
    filename: "[name].js",
    path: buildPath,
    clean: true
  },

  module: {
    rules: [
      {
        test: /.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          "resolve-url-loader",
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ],
      }
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "guides.css",
      chunkFilename: "[id].[contenthash].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          toType: "dir",
          from: "images/**/*",
          context: "./src/pkg",
        },
        {
          
          from: "manifest.json",
          context: "./src/pkg",
        },
      ],
    }),
  ],
};
