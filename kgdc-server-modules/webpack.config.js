const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    users: './src/module-users/main.ts',
    // flights: './src/module-flights/main.ts',
    // attendance: './src/module-attendance/main.ts'
  },
  target: 'node',
  externals: [nodeExternals()],
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_module/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'module-[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};