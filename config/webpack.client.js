const path = require('path');
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')

const ROOT_PATH = path.resolve(__dirname, '..')
const BUILD_PATH = path.resolve(ROOT_PATH, 'build')
const CONFIG_PATH = path.resolve(ROOT_PATH, 'config')
const ENTRY_PATH = path.resolve(ROOT_PATH, 'client', 'entry.js')

const config = {
  mode: "development",
  entry: ENTRY_PATH,
  output: {
    path: BUILD_PATH,
    filename: '[name].[hash].js',
    publicPath: '/build'
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
        options: {
          removeTags: true,
          classPrefix: "svg-"
        }
      }
    ]
  },
  plugins: [
    new HTMLPlugin({
      template: path.resolve(CONFIG_PATH, 'index.template.html')
    }),
    new webpack.EnvironmentPlugin({
      WEBSITE_ROOT: 'http://localhost:8080'
    })
  ],
  resolve: {
    extensions: ['.js', '.json', '.css'],
    alias: {
      '@': path.resolve(ROOT_PATH)
    }
  }
};

module.exports = config;