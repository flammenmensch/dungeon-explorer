const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const productionCheck = (env) => (a, b) => (env && env.production) ? a : b;

module.exports = (env) => {
  const isProduction = productionCheck(env);
  const outputDir = isProduction('dist', 'build');

  return {
    entry: {
      vendor: [
        'p2',
        'pixi',
        'phaser',
      ],
      game: path.join(__dirname, 'src/index.ts')
    },
    output: {
      path: path.join(__dirname, outputDir),
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        pixi: path.join(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
        phaser: path.join(__dirname, 'node_modules/phaser-ce/build/custom/phaser-split.js'),
        p2: path.join(__dirname, 'node_modules/phaser-ce/build/custom/p2.js')
      }
    },
    module: {
      rules: [
        { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' },
        { test: /p2\.js$/, loader: 'expose-loader?p2' },
        { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
        { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
        { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
      ]
    },
    plugins: [
      ...(isProduction([
        new UglifyJSPlugin({
          sourceMap: true,
          uglifyOptions: {
            mangle: true,
            compress: true
          }
        })
      ], [])),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': isProduction(`'production'`, `'development'`)
      }),
      new CleanPlugin([ path.join(__dirname, outputDir) ]),
      new CopyPlugin([ { context: 'public', from: '**/*', ignore: [ '*.tmx', '*.tsx' ] } ])
    ],
    devtool: 'source-map',
    devServer: {
      contentBase: path.join(__dirname, 'build'),
      compress: true,
      port: 8080,
      open: true,
      inline: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: true,
        ignored: /node_modules/
      }
    }
  };
};
