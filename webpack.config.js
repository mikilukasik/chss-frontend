const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const { mode = "development" } = argv;
  let devtool = "inline-source-map";
  let outPath = path.resolve(__dirname, "dist");

  if (mode === "production") {
    console.log("creating production build");
    devtool = false;
    outPath = path.resolve(__dirname, "docs");
  }

  const webpackConfig = [
    {
      entry: `./src/fe-${process.env.CHSS_ENV}.ts`,
      mode,
      devtool,
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
          },
          {
            test: /\.scss$/,
            use: ["style-loader", "css-loader", "sass-loader"],
          },
        ],
      },
      resolve: {
        extensions: [".tsx", ".ts", ".js"],
      },
      output: {
        filename: "fe.js",
        path: outPath,
      },
      plugins: [
        new CopyWebpackPlugin({
          patterns: [{ from: "public", to: "." }],
        }),
      ],
    },

    {
      entry: `./src/main-worker-${process.env.CHSS_ENV}.ts`,
      mode,
      devtool,
      module: {
        rules: [
          {
            test: /\.worker\.ts$/,
            loader: "worker-loader",
            exclude: [/node_modules/],
          },
          {
            test: /\.ts$/,
            use: "ts-loader",
            exclude: [/node_modules/],
          },
        ],
      },
      resolve: {
        extensions: [".ts", ".js"],
      },
      output: {
        filename: "main-worker.js",
        path: outPath,
      },
      experiments: {
        topLevelAwait: true,
      },
    },

    {
      entry: `./config/${process.env.CHSS_ENV}.ts`,
      mode,
      devtool,
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: "ts-loader",
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: [".ts"],
      },
      output: {
        filename: "config.js",
        path: outPath,
      },
      plugins: [],
    },
  ];

  return webpackConfig;
};
