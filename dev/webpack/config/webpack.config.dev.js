const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { config, root } = require('./webpack.config.base');

module.exports = merge(config, {
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'postcss-loader',
          {
            loader: 'less-loader',

            options: { javascriptEnabled: true },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
    publicPath: '/',
    port: 9000,
    quiet: true,
    contentBase: path.join(root, 'dist'),
  },
});
