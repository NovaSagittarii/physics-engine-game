import path from 'path';
import webpack from 'webpack';

import HtmlWebPackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import WebpackBar from 'webpackbar';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: webpack.Configuration = {
  name: 'client',
  entry: './src/client/index.tsx',
  output: {
    path: path.join(__dirname, 'dist/public'),
    publicPath: '/',
    filename: '[name].js',
  },
  target: 'web',
  devtool: 'source-map',
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/client/index.html',
      filename: './index.html',
      excludeChunks: ['server'],
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.jsx'],
  },
};

export default config;
