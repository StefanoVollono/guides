const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",

  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: {
    index: "./src/index.js",
  },

  // This option controls if and how source maps are generated.
  // https://webpack.js.org/configuration/devtool/
  devtool: "source-map",

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
  },

  // https://webpack.js.org/concepts/plugins/
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: true,
      chunks: ["index"],
      filename: "index.html",
    }),
  ],

  module: {
    rules: [
      {
        test: /.s?css$/,
        use: ["style-loader", 'css-loader', "resolve-url-loader", 'sass-loader'],
      },
      // {
      //   test: /\.(png|svg|jpe?g|gif)$/,
      //   include: /images/,
      //   use: [
      //     {
      //       loader: "file-loader",
      //       options: {
      //         name: "[name].[ext]",
      //         outputPath: "images/",
      //         publicPath: "images/",
      //       },
      //     },
      //   ],
      // },
    ],
  },
};
