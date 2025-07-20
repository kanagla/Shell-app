const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const deps = require("./package.json").dependencies;
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development", // ✅ USE dev mode for local server
  devServer: {
    port: 3001,
    host: '0.0.0.0',
    static: {
      directory: path.resolve(__dirname, 'public'),
      publicPath: '/',
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
        { from: /^\/dashboard/, to: '/index.html' },
      ],
      disableDotRule: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    publicPath: "/",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts|js)?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shellApp',
      remotes: {
        ordersApp: 'ordersApp@/microfrontends/orders/1.0.0/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
        zustand: { singleton: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" }
      ],
    }),
  ],
};
