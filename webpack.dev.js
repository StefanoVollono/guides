const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",

  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: {
    demo: "./src/demo.js",
  },

  // This option controls if and how source maps are generated.
  // https://webpack.js.org/configuration/devtool/
  devtool: "source-map",

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'src'),
    },
  },

  // https://webpack.js.org/concepts/plugins/
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/demo.html",
      inject: true,
      chunks: ["demo"],
      filename: "demo.html",
    }),
  ],

  module: {
    rules: [
      {
        test: /.s?css$/,
        use: ["style-loader", 'css-loader', "resolve-url-loader", 'sass-loader'],
      },
    ],
  },
};
