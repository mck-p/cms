const path = require('path')
const defaultConfig = require('./webpack.client')
const nodeExternals = require('webpack-node-externals');
const ROOT_PATH = path.resolve(__dirname, '..')

defaultConfig.entry = path.resolve(ROOT_PATH, 'server', 'index.js')

defaultConfig.output =  {
  path: path.resolve(ROOT_PATH, 'build', 'server',),
  filename: 'start.js',
  publicPath: '/'
}

delete defaultConfig.plugins

defaultConfig.target = 'node'

defaultConfig.externals = [nodeExternals()]

module.exports = defaultConfig