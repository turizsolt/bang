const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const distFolder = './build';

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{ from: 'public', to: 'public' }]),
  ],
  externals: nodeModules,
  devtool: 'inline-source-map',
  devServer: {
    contentBase: distFolder,
    host: '0.0.0.0',
    public: 'localhost:8080'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, distFolder),
    libraryTarget : "commonjs2",
    globalObject: 'this'
  }
};
