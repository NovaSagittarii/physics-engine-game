import path from 'path';
import webpack from 'webpack';
import webpackNodeExternals from 'webpack-node-externals';
// in case you run into any typescript error when configuring `devServer`
// import 'webpack-dev-server';

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import WebpackBar from 'webpackbar';
import ESLintPlugin from 'eslint-webpack-plugin';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: webpack.Configuration = {
  cache: {
    type: 'filesystem',
    // allowCollectingMemory: true,
    // compression: 'gzip',
    buildDependencies: {
      config: [__filename],
    },
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // transpileOnly: true,
          },
        },
      },
      // {
      //   // Transpiles ES6-8 into ES5
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //   },
      // },
    ],
  },
  plugins: [
    // new ForkTsCheckerWebpackPlugin(),
    new WebpackBar(),
    new ESLintPlugin({
      cache: true,
      extensions: ['ts', 'tsx', 'js', 'jsx'],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'node',
  output: {
    filename: '[name].bundle.cjs',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  experiments: {
    asyncWebAssembly: true,
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};

export default config;
