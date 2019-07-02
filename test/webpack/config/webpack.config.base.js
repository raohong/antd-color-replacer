const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const AntdColorReplacer = require('../../../lib').default;
const { tint } = require('../../../lib/utils');

const root = process.cwd();
const env = process.env.NODE_ENV;
const entryDirName = 'test';

const primaryColor = '#0081ff';
const getColors = primaryColor => {
  return [primaryColor];
};

const config = {
  context: root,
  mode: env,
  entry: path.join(root, entryDirName, 'entry.js'),
  output: {
    path: path.join(root, 'dist'),
    publicPath: '/',
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'all',
          filename: 'js/vendor.[chunkHash].js',
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          chunks: 'all',
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(?:jsx?|tsx?)$/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(root, entryDirName, 'template.html'),
    }),

    new AntdColorReplacer({
      primaryColor,
      antd: false,
      colors: getColors(primaryColor),
    }),
  ],
};

module.exports = {
  root,
  config,
  env,
  getColors,
};
