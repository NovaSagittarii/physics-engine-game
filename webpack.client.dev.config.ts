import path from 'path';
import webpack from 'webpack';

import HtmlWebPackPlugin from 'html-webpack-plugin';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: webpack.Configuration = {
  cache: true,
  mode: 'development',
  entry: ['react-hot-loader/patch', './src/client/index.tsx'],
  output: {
    path: path.join(__dirname, 'dist/public'),
    publicPath: '/',
    filename: '[name].js',
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/client/index.html',
      filename: './index.html',
      excludeChunks: ['server'],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  experiments: {
    asyncWebAssembly: true,
  },
};

export default config;
