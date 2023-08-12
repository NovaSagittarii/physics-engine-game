import path from 'path';
import webpack from 'webpack';
import webpackNodeExternals from 'webpack-node-externals';
// in case you run into any typescript error when configuring `devServer`
// import 'webpack-dev-server';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: webpack.Configuration = {
  mode: 'development',
  entry: './src/server/index.ts',
  externals: [
    // webpackNodeExternals(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        // Transpiles ES6-8 into ES5
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  target: 'node',
  output: {
    filename: 'bundle.cjs',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  experiments: {
    asyncWebAssembly: true,
  },
};

export default config;