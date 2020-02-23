const path = require('path');

const pkgName = 'simple2canvas';
let filename = pkgName.toLowerCase() + '.umd';
if (process.env.npm_lifecycle_script.includes('production')) {
  filename += '.min';
}
filename += '.js';

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename,
    library: pkgName,
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader?cacheDirectory'
      }
    ]
  }
};