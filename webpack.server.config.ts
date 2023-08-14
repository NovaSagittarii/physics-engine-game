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
  name: 'server',
  entry: './src/server/index.ts',
  externals: {
    // related to express warning, something about request critical dependency
    // https://stackoverflow.com/a/68386977/21507383
    express: 'require("express")',
    // webpackNodeExternals(), // this doesnt fix it (idk why)
  },
  output: {
    filename: '[name].bundle.cjs',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
};

export default config;
