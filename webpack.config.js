// shell-app/webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const deps = require("./package.json").dependencies;

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  devServer: {
    port: 3001,
    host: '0.0.0.0', // 🔥 Required for ECS/ALB access
    historyApiFallback: true,
    client: {
      overlay: false, // 👈 Disable error overlay to see raw browser error
    },
    headers: {
      "Access-Control-Allow-Origin": "*", // 👈 Allow remote modules to load
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
        ordersApp: 'ordersApp@http://localhost:3002/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
          eager: false,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
          eager: false,
        },
        zustand: { singleton: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
